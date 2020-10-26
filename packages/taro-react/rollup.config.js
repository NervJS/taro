const { join } = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const typescript = require('rollup-plugin-typescript2')
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
  external: ['@tarojs/runtime', 'scheduler', 'react-reconciler'],
  plugins: [
    alias({
      entries: [
        {
          find: '@tarojs/shared',
          replacement: join(cwd, '../shared/dist/shared.esm')
        }
      ]
    }),
    typescript(),
    buble()
  ]
}

const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/react.esm.js')
  }),
  plugins: baseConfig.plugins.slice(0, baseConfig.plugins.length - 1)
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
