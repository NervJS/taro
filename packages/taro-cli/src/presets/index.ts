import * as path from 'path'

export default () => {
  return {
    plugins: [
      // hooks
      path.resolve(__dirname, 'hooks', 'build.js'),

      // 兼容其他平台小程序插件
      path.resolve(__dirname, 'files', 'writeFileToDist.js'),
      path.resolve(__dirname, 'files', 'generateProjectConfig.js'),
      path.resolve(__dirname, 'files', 'generateFrameworkInfo.js')
    ]
  }
}
