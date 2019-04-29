import * as path from 'path'
import * as Chain from 'webpack-chain'

import { getRootPath, appPath } from '../util'

export default () => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['main:h5', 'module', 'main'],
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
