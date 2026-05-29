import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import ts from '@rollup/plugin-typescript'
import { recursiveMerge } from '@tarojs/helper'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

// 合并 SCSS 文件到 original 构建输出目录
function mergeScssFiles() {
  return {
    name: 'merge-scss-files',
    writeBundle(options) {
      if (!options.dir?.includes('original')) return

      const outputDir = options.dir
      const srcDir = path.join(process.cwd(), 'src')
      const componentsDir = path.join(outputDir, 'components')

      if (!fs.existsSync(componentsDir)) return

      fs.readdirSync(componentsDir).forEach((component) => {
        const componentDir = path.join(componentsDir, component)
        if (!fs.statSync(componentDir).isDirectory()) return

        const styleDir = path.join(componentDir, 'style')
        fs.mkdirSync(styleDir, { recursive: true })

        const srcStyleDir = path.join(srcDir, 'components', component, 'style')
        const indexScssPath = path.join(srcStyleDir, 'index.scss')

        if (fs.existsSync(indexScssPath)) {
          const mergedContent = mergeScssFile(indexScssPath, srcStyleDir)
          fs.writeFileSync(path.join(styleDir, 'index.scss'), mergedContent)
        }
      })
    },
  }
}

// 递归合并 SCSS 文件内容
function mergeScssFile(filePath, baseDir, processedFiles = new Set()) {
  if (processedFiles.has(filePath)) return `/* Circular import: ${path.basename(filePath)} */`

  processedFiles.add(filePath)
  let content = fs.readFileSync(filePath, 'utf8')

  content = content.replace(/@import\s+['"]([^'"]+)['"];?/g, (match, importPath) => {
    let resolvedPath = importPath.startsWith('./')
      ? path.resolve(path.dirname(filePath), importPath)
      : path.resolve(baseDir, importPath)

    if (!resolvedPath.endsWith('.scss')) resolvedPath += '.scss'

    return fs.existsSync(resolvedPath)
      ? `/* Imported from ${importPath} */\n${mergeScssFile(resolvedPath, baseDir, processedFiles)}`
      : `/* Missing: ${importPath} */`
  })

  processedFiles.delete(filePath)
  return content
}

// 清理 original 构建中的样式文件
function fixStyleImports() {
  return {
    name: 'fix-style-imports',
    writeBundle(options) {
      if (!options.dir?.includes('original')) return

      const componentsDir = path.join(options.dir, 'components')
      if (!fs.existsSync(componentsDir)) return

      fs.readdirSync(componentsDir).forEach((component) => {
        const componentDir = path.join(componentsDir, component)
        if (!fs.statSync(componentDir).isDirectory()) return

        const indexJsPath = path.join(componentDir, 'index.js')
        if (!fs.existsSync(indexJsPath)) return

        // 确保样式 import 语句正确引用 SCSS 文件
        let content = fs.readFileSync(indexJsPath, 'utf8')
        // 将 .scss.js 或 .css.js 的导入改为 .scss 导入
        content = content.replace(/import\s+['"]\.\/style\/index\.(scss|css)\.js['"];?\s*/g, "import './style/index.scss';\n")
        fs.writeFileSync(indexJsPath, content)

        // 清理 .scss.js 和 .scss.js.map 文件
        const styleDir = path.join(componentDir, 'style')
        if (fs.existsSync(styleDir)) {
          fs.readdirSync(styleDir).forEach((file) => {
            if (file.endsWith('.scss.js') || file.endsWith('.scss.js.map')) {
              fs.unlinkSync(path.join(styleDir, file))
            }
          })
        }
      })
    },
  }
}

// 自定义样式处理插件 - 替换 rollup-plugin-styles
function customStylesPlugin() {
  return {
    name: 'custom-styles-plugin',
    // 处理 SCSS 文件导入，让 Rollup 能够识别
    load(id) {
      if (id.endsWith('.scss')) {
        // 返回空的 CSS 内容，让 Rollup 能够处理导入
        return '/* SCSS file - processed by custom plugin */'
      }
      return null
    },
    // 在 writeBundle 阶段进行后处理
    writeBundle(options) {
      // 只处理 original 构建模式
      if (!options.dir?.includes('original')) return

      // 确保样式文件保持原始格式，不进行任何编译
      const outputDir = options.dir
      const componentsDir = path.join(outputDir, 'components')

      if (!fs.existsSync(componentsDir)) return

      // 遍历所有组件目录，确保 SCSS 文件保持原始格式
      fs.readdirSync(componentsDir).forEach((component) => {
        const componentDir = path.join(componentsDir, component)
        if (!fs.statSync(componentDir).isDirectory()) return

        const styleDir = path.join(componentDir, 'style')
        if (fs.existsSync(styleDir)) {
          // 清理任何可能由其他插件生成的异常文件
          fs.readdirSync(styleDir).forEach((file) => {
            const filePath = path.join(styleDir, file)
            // 删除非 SCSS 的样式相关文件
            if (file.endsWith('.css') ||
                file.endsWith('.css.map') ||
                file.endsWith('.scss.js') ||
                file.endsWith('.scss.js.map') ||
                file.endsWith('.css.js') ||
                file.endsWith('.css.js.map')) {
              try {
                fs.unlinkSync(filePath)
              } catch (error) {
                console.warn(`Failed to delete file ${filePath}:`, error.message)
              }
            }
          })
        }
      })
    }
  }
}

function getPlugins(pre = [], post = [], isOriginal = false) {
  const basePlugins = [
    ...pre,
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
    }),
    // 根据模式选择样式处理插件
    isOriginal
      ? customStylesPlugin() // 使用自定义样式插件，保持 SCSS 原始格式
      : postcss({
        extract: true,
        inject: { insertAt: 'top' },
        minimize: true,
      }),
    ts(),
    commonjs({
      include: '../../node_modules/**',
    }),
    ...post,
  ]
  return basePlugins
}

function getAliasPlugin(framework) {
  return alias({
    entries: [{ find: /.*hooks$/, replacement: (source) => source.replace(/hooks$/, `hooks.${framework}.ts`) }],
  })
}

const base = {
  treeshake: false,
  output: {
    chunkFileNames: '[name].js',
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
}

const babelConfig = {
  extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
  babelHelpers: 'runtime',
}

const react = () => {
  const config = recursiveMerge({}, base, {
    input: {
      index: 'src/index.react.ts',
    },
    plugins: getPlugins(
      [getAliasPlugin('react')],
      [
        babel({
          ...babelConfig,
          presets: [
            [
              '@babel/preset-react',
              {
                pure: true,
                runtime: 'automatic',
                useSpread: true,
              },
            ],
          ],
        }),
        replace({
          preventAssignment: true,
          'process.env.FRAMEWORK': JSON.stringify('react'),
        }),
      ]
    ),
  })
  return config
}

const solid = () => {
  const config = recursiveMerge({}, base, {
    input: {
      index: 'src/index.solid.ts',
    },
    output: {
      dir: 'dist/solid',
    },
    plugins: getPlugins(
      [getAliasPlugin('solid')],
      [
        babel({
          ...babelConfig,
          presets: ['babel-preset-solid'],
        }),
        replace({
          preventAssignment: true,
          'process.env.FRAMEWORK': JSON.stringify('solid'),
        }),
      ]
    ),
  })
  return config
}

const original = () => {
  const config = recursiveMerge({}, base, {
    input: {
      index: 'src/index.react.ts',
    },
    output: {
      dir: 'dist/original',
      // 移除 assetFileNames 配置，因为 original 构建不再生成 CSS 文件
    },
    plugins: getPlugins(
      [getAliasPlugin('react')],
      [
        babel({
          ...babelConfig,
          presets: [
            [
              '@babel/preset-react',
              {
                pure: true,
                runtime: 'automatic',
                useSpread: true,
              },
            ],
          ],
        }),
        replace({
          preventAssignment: true,
          'process.env.FRAMEWORK': JSON.stringify('react'),
        }),
        mergeScssFiles(), // 合并 SCSS 文件到输出目录
        fixStyleImports(), // 修复样式 import 语句，保持 SCSS 引用
      ],
      true // 标记为 original 模式
    ),
  })
  return config
}

// 供 Loader 使用的运行时入口
export default defineConfig([react(), solid(), original()])
