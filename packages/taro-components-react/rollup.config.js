import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'

// 供 Loader 使用的运行时入口
export default {
  external: (d) => {
    return (
      /^react$/.test(d) ||
      /^react-dom$/.test(d) ||
      /^raf$/.test(d) ||
      /^@tarojs\/taro$/.test(d) ||
      /^@tarojs\/taro-h5$/.test(d) ||
      d.includes('@babel/runtime')
    )
  },
  input: {
    'view/index': 'src/components/view/index.tsx',
    'scroll-view/index': 'src/components/scroll-view/index.tsx',
    'text/index': 'src/components/text/index.tsx',
    'pull-down-refresh/index': 'src/components/pull-down-refresh/index.tsx',
    'image/index': 'src/components/image/index.tsx',
    'swiper/index': 'src/components/swiper/index.tsx',
    'react-wx-images-viewer/index': 'src/components/react-wx-images-viewer/index.tsx'
  },
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false
    }),
    postcss({
      inject: { insertAt: 'top' }
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ],
  output: {
    entryFileNames: '[name].js',
    dir: 'dist',
    chunkFileNames: '[name].js',
    format: 'es',
    sourcemap: true
  }
}
