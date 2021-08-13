module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        ios: '9',
        android: '5'
      },
      modules: false
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime'
  ]
}
