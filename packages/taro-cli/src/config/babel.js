module.exports = {
  sourceMap: true,
  presets: [
    'env'
  ],
  plugins: [
    require('babel-plugin-transform-react-jsx'),
    'transform-class-properties',
    'transform-decorators-legacy',
    'transform-object-rest-spread'
  ]
}
