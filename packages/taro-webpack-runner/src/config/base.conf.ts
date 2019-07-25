import * as path from 'path'
import * as Chain from 'webpack-chain'

import { getRootPath } from '../util'

export default (appPath: string) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['main:h5', 'browser', 'module', 'main'],
      symlinks: true,
      modules: [
        path.join(appPath, 'node_modules'),
        'node_modules'
      ]
    },
    resolveLoader: {
      modules: [
        path.join(getRootPath(), 'node_modules'),
        'node_modules'
      ]
    }
  })

  return chain
}
