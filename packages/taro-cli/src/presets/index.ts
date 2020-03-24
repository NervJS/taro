import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      path.resolve(__dirname, 'platforms', 'weapp.js'),
      path.resolve(__dirname, 'platforms', 'tt.js'),
      path.resolve(__dirname, 'platforms', 'alipay.js'),

      // commands
      path.resolve(__dirname, 'commands', 'build.js'),

      // files
      path.resolve(__dirname, 'files', 'writeFileToDist.js'),
      path.resolve(__dirname, 'files', 'generateProjectConfig.js')
    ]
  }
}
