import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

const config = {
  input: ['src/index.ts', 'src/components-loader.ts', 'src/component-lib/index.ts'],
  output: {
    dir: '../taro-components/lib/vue3',
    exports: 'named',
    preserveModules: true,
    sourcemap: true,
    preserveModulesRoot: 'src',
  },
  treeshake: false,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: 'vue',
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
