import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import ts from '@rollup/plugin-typescript'
import { recursiveMerge } from '@tarojs/helper'
import { defineConfig } from 'rollup'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

function getPlugins (pre = [], post = []) {
  return [
    ...pre,
    externals({
      deps: true,
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    postcss({
      extract: true,
      inject: { insertAt: 'top' },
      minimize: true,
    }),
    ts(),
    commonjs({
      include: '../../node_modules/**'
    }),
    ...post
  ]
}

function getAliasPlugin (framework) {
  return alias({
    entries: [
      { find: /.*hooks$/, replacement: (source) => source.replace(/hooks$/, `hooks.${framework}.ts`) }
    ]
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
  }
}

const babelConfig = {
  extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
  babelHelpers: 'runtime',
}

const react = () => {
  const config = recursiveMerge({}, base, {
    input: {
      index: 'src/index.react.ts'
    },
    plugins: getPlugins(
      [
        getAliasPlugin('react'),
      ],
      [
        babel({
          ...babelConfig,
          presets: [
            ['@babel/preset-react', {
              pure: true,
              runtime: 'automatic',
              useSpread: true,
            }],
          ],
        }),
        replace({
          preventAssignment: true,
          'process.env.FRAMEWORK': JSON.stringify('react'),
        })
      ]
    )
  })
  return config
}

const solid = () => {
  const config = recursiveMerge({}, base, {
    input: {
      index: 'src/index.solid.ts'
    },
    output: {
      dir: 'dist/solid',
    },
    plugins: getPlugins(
      [
        getAliasPlugin('solid')
      ],
      [
        babel({
          ...babelConfig,
          presets: [
            'babel-preset-solid',
          ],
        }),
        replace({
          preventAssignment: true,
          'process.env.FRAMEWORK': JSON.stringify('solid'),
        }),
      ]
    )
  })
  return config
}

// 供 Loader 使用的运行时入口
export default defineConfig([react(), solid()])
