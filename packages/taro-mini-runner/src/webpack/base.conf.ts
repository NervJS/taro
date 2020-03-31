import * as path from 'path'
import * as Chain from 'webpack-chain'

export default (appPath: string) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', 'mjs'],
      mainFields: ['browser', 'module', 'main'],
      symlinks: true,
      modules: [
        'node_modules',
        path.join(appPath, 'node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        'node_modules'
      ]
    }
  })

  return chain
}
