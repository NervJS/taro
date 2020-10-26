const { join } = require('path')
const buble = require('rollup-plugin-buble')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
// const alias = require('rollup-plugin-alias')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  external: ['@tarojs/runtime'],
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    // alias({
    //   entries: [
    //     {
    //       find: '@tarojs/shared',
    //       replacement: join(cwd, '../shared/dist/shared.esm')
    //     }
    //   ]
    // }),
    resolve(),
    commonjs(),
    typescript(),
    buble({ transforms: { asyncAwait: false } })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/router.esm.js')
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
