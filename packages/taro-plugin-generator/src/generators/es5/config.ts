/* eslint-disable no-console */
import generate from '@babel/generator'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import dedent from 'dedent'

import { ensureNestedObjectProperty } from '../../utils/ast'
import { GeneratorError, GeneratorErrorType } from '../../utils/error'

import type { IPluginContext } from '@tarojs/service'

const modifiedConfigError = new GeneratorError({
  type: GeneratorErrorType.modifyConfig,
  message: dedent(`
    {
      mini: {
        compile: {
          include: [
            filename => /node_modules\\/(?!(.pnpm|@babel|core-js|style-loader|css-loader|react|react-dom))(@?[^/]+)/.test(filename)
          ]
        }
      },
      h5: {
        compile: {
          include: [
            filename => /node_modules\\/(?!(.pnpm|@babel|core-js|style-loader|css-loader|react|react-dom))(@?[^/]+)/.test(filename)
          ]
        }
      }
    }
  `),
})

/**
 * 更新配置文件
 */
export async function updateConfig(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const sourceCode = await fs.readFile(ctx.paths.configPath, { encoding: 'utf-8' })

  const ast = parser.parse(sourceCode, { sourceType: 'module', plugins: ['typescript'] })
  insertBrowerlistEnv(ast)
  let miniUpdated = false
  let h5Updated = false
  traverse(ast, {
    ObjectProperty: (o) => {
      const { node } = o
      if (t.isIdentifier(node.key) && node.key.name === 'mini' && t.isObjectExpression(node.value)) {
        modifyCompileConfig(node.value)
        miniUpdated = true
      }
      if (t.isIdentifier(node.key) && node.key.name === 'h5' && t.isObjectExpression(node.value)) {
        modifyCompileConfig(node.value)
        h5Updated = true
      }
    },
  })
  if (!miniUpdated || !h5Updated) {
    throw modifiedConfigError
  }
  const { code } = generate(ast)
  await fs.outputFile(ctx.paths.configPath, code, { encoding: 'utf-8' })
  console.log('✅ 更新配置文件成功\n')
}

function modifyCompileConfig(config: t.ObjectExpression) {
  ensureNestedObjectProperty(config, ['compile'])
  const compileProp = config.properties.find(
    (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'compile'
  ) as t.ObjectProperty | undefined
  if (compileProp && t.isObjectExpression(compileProp.value)) {
    const includeProp = compileProp.value.properties.find(
      (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'include'
    )

    const include = t.arrowFunctionExpression(
      [t.identifier('filename')],
      t.callExpression(
        t.memberExpression(
          t.regExpLiteral(
            String.raw`node_modules\/(?!(.pnpm|@babel|core-js|style-loader|css-loader|react|react-dom))(@?[^/]+)`,
            ''
          ),
          t.identifier('test')
        ),
        [t.identifier('filename')]
      )
    )
    include.params[0].typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword())

    if (!includeProp) {
      compileProp.value.properties.push(t.objectProperty(t.identifier('include'), t.arrayExpression([include])))
    } else if (t.isObjectProperty(includeProp) && t.isArrayExpression(includeProp.value)) {
      includeProp.value.elements.push(include)
    } else {
      throw modifiedConfigError
    }
  }
}

/**
 * 往配置文件中插入：
 * process.env.BROWSERSLIST_ENV = process.env.NODE_ENV
 */
function insertBrowerlistEnv(ast: t.Node) {
  let hasEnv = false
  traverse(ast, {
    AssignmentExpression(path) {
      const { node } = path
      // 判断左侧是 process.env.BROWSERSLIST_ENV
      const isLeftMatch =
        node.left.type === 'MemberExpression' &&
        node.left.object.type === 'MemberExpression' &&
        node.left.object.object.type === 'Identifier' &&
        node.left.object.object.name === 'process' &&
        node.left.object.property.type === 'Identifier' &&
        node.left.object.property.name === 'env' &&
        node.left.property.type === 'Identifier' &&
        node.left.property.name === 'BROWSERSLIST_ENV'
      // 判断右侧是 process.env.NODE_ENV
      const isRightMatch =
        node.right.type === 'MemberExpression' &&
        node.right.object.type === 'MemberExpression' &&
        node.right.object.object.type === 'Identifier' &&
        node.right.object.object.name === 'process' &&
        node.right.object.property.type === 'Identifier' &&
        node.right.object.property.name === 'env' &&
        node.right.property.type === 'Identifier' &&
        node.right.property.name === 'NODE_ENV'

      if (isLeftMatch && isRightMatch) {
        hasEnv = true
        path.stop()
      }
    },
    Program: {
      exit(program) {
        if (!hasEnv) {
          const env = parser.parseExpression(
            'process.env.BROWSERSLIST_ENV = process.env.NODE_ENV'
          ) as unknown as t.ExpressionStatement
          const injectIndex = program.node.body.findIndex((stmt) => !t.isImportDeclaration(stmt))
          program.node.body.splice(injectIndex, 0, env)
        }
      },
    },
  })
}
