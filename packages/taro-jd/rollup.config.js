const { join } = require('path')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const base = {
  external: ['@tarojs/shared', '@tarojs/service'],
  plugins: [typescript({
    useTsconfigDeclarationDir: true
  })]
}

// 供 CLI 编译时使用的 Taro 插件入口
const comileConfig = {
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

// 供 Loader 使用的运行时入口
const runtimeConfig = {
  input: join(cwd, 'src/runtime.ts'),
  output: {
    file: join(cwd, 'dist/runtime.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

// 供继承的包使用，为了能 tree-shaking
const runtimeUtilsConfig = {
  input: join(cwd, 'src/runtime-utils.ts'),
  output: {
    file: join(cwd, 'dist/runtime-utils.js'),
    format: 'es',
    sourcemap: true
  },
  ...base
}

module.exports = [comileConfig, runtimeConfig, runtimeUtilsConfig]
