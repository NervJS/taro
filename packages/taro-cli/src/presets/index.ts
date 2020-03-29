import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      path.resolve(__dirname, 'platforms', 'weapp.js'),
      path.resolve(__dirname, 'platforms', 'tt.js'),
      path.resolve(__dirname, 'platforms', 'alipay.js'),
      path.resolve(__dirname, 'platforms', 'swan.js'),
      path.resolve(__dirname, 'platforms', 'jd.js'),
      path.resolve(__dirname, 'platforms', 'qq.js'),
      path.resolve(__dirname, 'platforms', 'quickapp.js'),
      path.resolve(__dirname, 'platforms', 'h5.js'),
      path.resolve(__dirname, 'platforms', 'rn.js'),
      path.resolve(__dirname, 'platforms', 'plugin.js'),
      path.resolve(__dirname, 'platforms', 'ui.js'),

      // commands
      path.resolve(__dirname, 'commands', 'build.js'),
      path.resolve(__dirname, 'commands', 'init.js'),
      path.resolve(__dirname, 'commands', 'config.js'),
      path.resolve(__dirname, 'commands', 'create.js'),
      path.resolve(__dirname, 'commands', 'info.js'),
      path.resolve(__dirname, 'commands', 'doctor.js'),
      path.resolve(__dirname, 'commands', 'convert.js'),
      path.resolve(__dirname, 'commands', 'update.js'),

      // files
      path.resolve(__dirname, 'files', 'writeFileToDist.js'),
      path.resolve(__dirname, 'files', 'generateProjectConfig.js'),
      path.resolve(__dirname, 'files', 'generateFrameworkInfo.js')
    ]
  }
}
