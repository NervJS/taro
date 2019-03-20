module.exports = {
  sourceMap: true,
  presets: [
    'env'
  ],
  plugins: [
    require('babel-plugin-transform-react-jsx'),
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread'
  ]
}
