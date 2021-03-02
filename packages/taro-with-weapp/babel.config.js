module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        ios: '9',
        android: '5'
      }
    }]
  ],
  plugins: ['@babel/plugin-transform-runtime']
}
