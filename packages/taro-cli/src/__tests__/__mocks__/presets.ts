import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      path.resolve(__dirname, '../../presets', 'platforms', 'weapp.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'tt.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'alipay.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'swan.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'jd.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'qq.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'quickapp.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'h5.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'rn.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'plugin.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'ui.ts'),

      // commands
      path.resolve(__dirname, '../../presets', 'commands', 'build.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'init.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'config.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'create.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'info.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'doctor.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'convert.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'update.ts'),
      path.resolve(__dirname, '../../presets', 'commands', 'inspect.ts'),

      // files
      path.resolve(__dirname, '../../presets', 'files', 'writeFileToDist.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateProjectConfig.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateFrameworkInfo.ts')
    ]
  }
}
