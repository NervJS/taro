import { getOptions } from 'loader-utils'
import * as webpack from 'webpack'
import appLoader from './app'
import pageLoader from './page'

export default function (this: webpack.loader.LoaderContext, source: string) {
  const options = getOptions(this)
  if (options.type === 'app') {
    appLoader.call(this, source)
  } else {
    pageLoader.call(this, source)
  }
}
