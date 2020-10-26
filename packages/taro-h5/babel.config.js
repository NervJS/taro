module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-transform-react-jsx', {
      pragma: 'Nerv.createElement'
    }]
  ]
}
