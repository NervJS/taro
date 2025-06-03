/* eslint-disable no-console */
import path from 'node:path'

import generate from '@babel/generator'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import dedent from 'dedent'

import { GeneratorError, GeneratorErrorType } from '../../utils/error'

import type { IPluginContext } from '@tarojs/service'

export async function emit(ctx: IPluginContext) {
  return Promise.all([emitCSS(ctx), injectTailwindCSSToEntry(ctx), emitPostcssConfig(ctx)])
}

async function emitPostcssConfig(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const { sourcePath } = ctx.paths

  const configFiles = ['postcss.config.js', 'postcss.config.mjs']
  let configPath: string | null = null

  for (const file of configFiles) {
    const fullPath = path.join(sourcePath, file)
    if (await fs.pathExists(fullPath)) {
      configPath = fullPath
      break
    }
  }

  const code = dedent(`
    export default { 
      plugins: {  
        "@tailwindcss/postcss": {}, 
      }
    }
  `)

  try {
    if (!configPath) {
      await fs.writeFile(path.join(sourcePath, 'postcss.config.mjs'), code, { encoding: 'utf-8' })
      return
    }

    const rawCode = await fs.readFile(configPath, 'utf-8')
    if (rawCode.trim().length === 0) {
      await fs.writeFile(configPath, code, { encoding: 'utf-8' })
      return
    }
    const ast = parser.parse(rawCode, {
      sourceType: 'module',
      plugins: ['typescript'],
    })

    let modified = false

    traverse(ast, {
      ObjectExpression(path) {
        const node = path.node
        // 找到 plugins 节点
        const pluginsProp = node.properties.find(
          (prop) =>
            t.isObjectProperty(prop) &&
            t.isIdentifier(prop.key, { name: 'plugins' }) &&
            t.isObjectExpression(prop.value)
        ) as t.ObjectProperty | undefined

        if (pluginsProp) {
          const pluginsNode = pluginsProp.value as t.ObjectExpression

          const hasTailwind = pluginsNode.properties.some((prop) => {
            return (
              t.isObjectProperty(prop) &&
              ((t.isStringLiteral(prop.key) && prop.key.value === '@tailwindcss/postcss') ||
                (t.isIdentifier(prop.key) && prop.key.name === '@tailwindcss/postcss'))
            )
          })

          if (!hasTailwind) {
            pluginsNode.properties.push(
              t.objectProperty(t.stringLiteral('@tailwindcss/postcss'), t.objectExpression([]))
            )
            modified = true
          }
        }
      },
    })

    if (modified) {
      const { code } = generate(ast, { retainLines: true })
      return fs.writeFile(configPath, code)
    }
  } catch {
    throw new GeneratorError({
      type: GeneratorErrorType.emitFile,
      targetFile: configPath ?? 'postcss.config.mjs',
      message: code,
    })
  }
}

async function emitCSS(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const outputPath = path.join(ctx.paths.sourcePath, 'tailwind.css')
  const importStmt = `@import "weapp-tailwindcss";\n`
  try {
    if (await fs.pathExists(outputPath)) {
      const existingContent = await fs.readFile(outputPath, 'utf-8')
      const alreadyImported = /@import\s+["']weapp-tailwindcss["'];?/.test(existingContent)
      if (alreadyImported) {
        return
      }
      const newContent = `${importStmt}${existingContent.trim()}`
      return fs.writeFile(outputPath, newContent, { encoding: 'utf-8' })
    }
    return fs.writeFile(outputPath, importStmt, { encoding: 'utf-8' })
  } catch {
    throw new GeneratorError({
      type: GeneratorErrorType.emitFile,
      targetFile: outputPath,
      message: `@import "weapp-tailwindcss";`,
    })
  }
}

export async function injectTailwindCSSToEntry(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const { sourcePath } = ctx.paths

  const possibleEntryFiles = ['app.ts', 'app.tsx', 'app.js', 'app.jsx']
  let entryPath: string | undefined

  // 找到存在的入口文件
  for (const file of possibleEntryFiles) {
    const fullPath = path.join(sourcePath, file)
    if (await fs.pathExists(fullPath)) {
      entryPath = fullPath
      break
    }
  }

  if (!entryPath) {
    throw new Error('❌ 找不到入口文件')
  }

  const importStatement = `import './tailwind.css'\n`
  const content = await fs.readFile(entryPath, 'utf-8')

  // 如果已导入 tailwind.css，跳过处理
  if (/import\s+['"]\.\/tailwind\.css['"]/.test(content)) {
    return
  }

  const updatedContent = importStatement + content
  try {
    await fs.writeFile(entryPath, updatedContent, { encoding: 'utf-8' })
  } catch {
    throw new GeneratorError({
      type: GeneratorErrorType.emitFile,
      targetFile: entryPath,
      message: importStatement,
    })
  }
}
