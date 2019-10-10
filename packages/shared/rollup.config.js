const { join } = require('path')
// const buble = require('rollup-plugin-buble')
// const babel = require('rollup-plugin-babel')
// const nodeResolve = require('rollup-plugin-node-resolve')
// const common = require('rollup-plugin-commonjs')
// const alias = require('rollup-plugin-alias')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

module.exports = {
  input: join(cwd, 'src/index.ts'),
  output: [
    {
      sourcemap: true,
      format: 'es',
      file: join(cwd, 'dist/index.esm.js')
    }
  ],
  plugins: [
    typescript()
  ]
}
