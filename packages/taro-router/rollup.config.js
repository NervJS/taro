import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'
import externals from 'rollup-plugin-node-externals'

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  output: [
    {
      file: path.join(cwd, 'dist/index.cjs.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    externals({
      devDeps: false
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true
    }),
    commonjs()
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
