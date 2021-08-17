import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import common from '@rollup/plugin-commonjs'
import * as path from 'path'

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  external: d => {
    return d.includes('@tarojs/runtime') || d.includes('@tarojs/taro') || d.includes('@babel/runtime')
  },
  output: [
    {
      file: path.join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: path.join(cwd, 'dist/with-weapp.js'),
      format: 'umd',
      name: 'TaroWithWeapp',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false
    }),
    common({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/index.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig]
  }
}
module.exports = rollup()
