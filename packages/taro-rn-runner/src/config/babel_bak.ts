const babelOptions: IBabelOptions = {
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

export default babelOptions

export interface IBabelOptions {
  sourceMap: boolean,
  presets: string[],
  plugins: any[]
}
