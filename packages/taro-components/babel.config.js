module.exports = {
  presets: [
    ['@babel/env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    'power-assert'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ],
  babelrcRoots: ['./h5/*']
}
