import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'

export default {
  input: [
    'src/index.ts',
    'src/components/index.ts',
    'src/components/virtual-list/index.ts',
    'src/components/virtual-list/react/index.ts',
    'src/components/virtual-list/vue/index.ts',
    'src/components/virtual-waterfall/index.ts',
    'src/components/virtual-waterfall/react/index.ts',
    'src/components/virtual-waterfall/vue/index.ts',
  ],
  output: {
    dir: 'dist',
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
      include: ['react', 'react-dom', 'vue'],
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    }),
    ts(),
    commonjs(),
    postcss({
      inject: { insertAt: 'top' },
      minimize: true,
    }),
  ],
}
