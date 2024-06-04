import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

const config = {
  input: ['src/index.ts', 'src/component-lib/index.ts'],
  output: {
    dir: '../taro-components/lib/solid',
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  treeshake: false,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: [/^solid-js\.*/, /@tarojs/],
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }),
    typescript(),
    commonjs({
      transformMixedEsModules: true,
      dynamicRequireTargets: ['./src/**/*.js'],
    }),
    postcss({
      inject: { insertAt: 'top' },
      minimize: true,
    }),
  ],
}

export default config
