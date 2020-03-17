export default function createBabelRegister ({ only, babelConfig }) {
  require('babel-register')({
    only: Array.from(new Set([...only])),
    presets: ['env'],
    plugins: babelConfig.plugins,
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    babelrc: false,
    cache: false
  })
}