import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      path.resolve(__dirname, '../../src/presets', 'platforms', 'weapp.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'tt.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'alipay.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'swan.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'jd.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'qq.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'quickapp.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'h5.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'rn.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'plugin.ts'),
      path.resolve(__dirname, '../../src/presets', 'platforms', 'ui.ts'),

      // commands
      path.resolve(__dirname, '../../src/presets', 'commands', 'build.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'init.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'config.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'create.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'info.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'doctor.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'convert.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'update.ts'),
      path.resolve(__dirname, '../../src/presets', 'commands', 'inspect.ts'),

      // files
      path.resolve(__dirname, '../../src/presets', 'files', 'writeFileToDist.ts'),
      path.resolve(__dirname, '../../src/presets', 'files', 'generateProjectConfig.ts'),
      path.resolve(__dirname, '../../src/presets', 'files', 'generateFrameworkInfo.ts')
    ]
  }
}
