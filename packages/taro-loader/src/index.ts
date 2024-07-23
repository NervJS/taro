import appLoader from './app'
import pageLoader from './page'

import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string) {
  const options = this.getOptions()
  if (options.type === 'app') {
    appLoader.call(this, source)
  } else {
    pageLoader.call(this, source)
  }
}
