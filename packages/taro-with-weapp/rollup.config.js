const typescript = require('rollup-plugin-typescript2')
const { join } = require('path')

module.exports = {
  input: 'src/index.ts',
  plugins: [
    typescript()
  ],
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      file: join(__dirname, 'dist/index.js')
    },
    {
      format: 'es',
      sourcemap: true,
      file: join(__dirname, 'dist/index.esm.js')
    }
  ]
}
