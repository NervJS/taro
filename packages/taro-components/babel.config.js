module.exports = {
  presets: [
    ['@babel/env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    'power-assert'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ['@babel/plugin-proposal-private-methods', { loose: false }]
  ],
  babelrcRoots: ['./h5/*']
}
