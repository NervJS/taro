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
import styles from 'rollup-plugin-styles'

// 自定义插件：修改 JS 文件中的样式 import 语句并删除无用的 .scss.js 文件
function fixStyleImports() {
  return {
    name: 'fix-style-imports',
    writeBundle(options) {
      if (!options.dir || !options.dir.includes('original')) return

      const outputDir = options.dir

      // 遍历所有组件目录
      const componentsDir = path.join(outputDir, 'components')
      if (!fs.existsSync(componentsDir)) return

      const components = fs.readdirSync(componentsDir)
      components.forEach((component) => {
        const componentDir = path.join(componentsDir, component)
        if (!fs.statSync(componentDir).isDirectory()) return

        const indexJsPath = path.join(componentDir, 'index.js')
        if (!fs.existsSync(indexJsPath)) return

        // 读取 JS 文件内容
        let content = fs.readFileSync(indexJsPath, 'utf8')

        // 替换样式 import 语句
        content = content.replace(/import\s+['"]\.\/style\/index\.(scss|css)\.js['"];?/g, "import './style/index.css';")

        // 写回文件
        fs.writeFileSync(indexJsPath, content)

        // 删除无用的 .scss.js 和 .css.js 文件
        const styleDir = path.join(componentDir, 'style')
        if (fs.existsSync(styleDir)) {
          const files = fs.readdirSync(styleDir)
          files.forEach((file) => {
            if (file.endsWith('.scss.js') || file.endsWith('.css.js')) {
              const filePath = path.join(styleDir, file)
              fs.unlinkSync(filePath)
              // eslint-disable-next-line no-console
              console.log(`Deleted unused file: ${filePath}`)
            }
            // 同时删除对应的 .map 文件
            if (file.endsWith('.scss.js.map') || file.endsWith('.css.js.map')) {
              const filePath = path.join(styleDir, file)
              fs.unlinkSync(filePath)
              // eslint-disable-next-line no-console
              console.log(`Deleted unused file: ${filePath}`)
            }
          })
        }
      })
    },
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
      ? styles({
        mode: 'extract',
        minimize: true,
        sourceMap: true,
        inject: false,
        fileName: (name) => {
          // 将 assets/components/button/index.css 转换为 components/button/style/index.css
          const match = name.match(/assets\/components\/([^/]+)\/index/)
          if (match) {
            return `components/${match[1]}/style/index.css`
          }
          // 主入口文件
          if (name.includes('index')) {
            return 'index.css'
          }
          return name.replace('assets/', '') + '.css'
        },
      })
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
      assetFileNames: (assetInfo) => {
        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
          // 主入口的CSS文件放在根目录，命名为index.css（只匹配主入口，不匹配组件）
          if (assetInfo.name === 'index.css' || assetInfo.name.match(/^index-[a-zA-Z0-9]+\.css$/)) {
            return 'index.css'
          }
          // 组件样式文件放在各自的style目录下
          if (assetInfo.name.includes('components/')) {
            const match = assetInfo.name.match(/components\/([^/]+)\/index/)
            if (match) {
              return `components/${match[1]}/style/index.css`
            }
          }
        }
        return 'assets/[name]-[hash][extname]'
      },
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
        fixStyleImports(), // 添加自定义插件来修复样式 import 语句
      ],
      true // 标记为 original 模式
    ),
  })
  return config
}

// 供 Loader 使用的运行时入口
export default defineConfig([react(), solid(), original()])
