module.exports = {
  presets: [
    ['@babel/preset-env', {
      loose: false,
      debug: false,
      modules: false,
      targets: {
        ios: '9',
        android: '4.4'
      }
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      helpers: true
    }]
  ]
}
