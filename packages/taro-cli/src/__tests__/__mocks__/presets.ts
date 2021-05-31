import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      require.resolve('@tarojs/plugin-platform-weapp'),
      require.resolve('@tarojs/plugin-platform-alipay'),
      require.resolve('@tarojs/plugin-platform-swan'),
      require.resolve('@tarojs/plugin-platform-tt'),
      require.resolve('@tarojs/plugin-platform-qq'),
      require.resolve('@tarojs/plugin-platform-jd'),
      path.resolve(__dirname, '../../presets', 'platforms', 'h5.ts'),
      path.resolve(__dirname, '../../presets', 'platforms', 'plugin.ts'),

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
