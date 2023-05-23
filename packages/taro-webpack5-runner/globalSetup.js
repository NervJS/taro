const path = require('path')
const webpack = require('webpack')

module.exports = () => {
  return Promise.resolve()
    .then(() => {
      const compiler = webpack({
        devtool: false,
        mode: 'development',
        target: 'node',
        // 需要在当前目录安装一份 globby 依赖，否则使用 pnpm 时无法获取到 copy-webpack-plugin 中 globby 的依赖
        entry: path.resolve(__dirname, 'node_modules/globby/index.js'),
        output: {
          path: path.resolve(__dirname, 'src/__tests__/bundled/globby'),
          filename: 'index.js',
          library: {
            type: 'commonjs2',
          },
        },
      })

      return new Promise((resolve, reject) => {
        compiler.run((error) => {
          if (error) {
            reject(error)

            return
          }

          compiler.close(() => {
            resolve()
          })
        })
      })
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      process.exit(1)
    })
}
