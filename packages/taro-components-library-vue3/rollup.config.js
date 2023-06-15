import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-ts'

const config = {
  input: ['src/index.ts', 'src/components-loader.ts', 'src/component-lib/index.ts'],
  output: {
    dir: '../taro-components/lib/vue3',
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true
  },
  treeshake: false,
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      include: 'vue'
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      sourceMap: true,
    }),
    commonjs({
      transformMixedEsModules: true,
      dynamicRequireTargets: ['./src/**/*.js']
    }),
    postcss({
      inject: { insertAt: 'top' }
    })
  ]
}

export default config
