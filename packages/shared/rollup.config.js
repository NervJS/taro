import ts from 'rollup-plugin-ts'

const { join } = require('path')

const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    ts({
      preserveConstEnums: true
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output[0], {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/shared.esm.js')
  }),
  plugins: [
    ts()
  ]
})

// template 只在编译时使用
const templateConfig = {
  input: join(cwd, 'src/template.ts'),
  output: [
    {
      file: join(cwd, 'dist/template.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    ts()
  ]
}

module.exports = [baseConfig, esmConfig, templateConfig]
