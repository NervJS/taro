import * as path from 'path'

export default () => {
  return {
    plugins: [
      // platforms
      path.resolve(__dirname, 'platforms', 'h5.js'),
      path.resolve(__dirname, 'platforms', 'rn.js'),
      path.resolve(__dirname, 'platforms', 'plugin.js'),
      ['@tarojs/plugin-platform-weapp', { backup: require.resolve('@tarojs/plugin-platform-weapp') }],
      ['@tarojs/plugin-platform-alipay', { backup: require.resolve('@tarojs/plugin-platform-alipay') }],
      ['@tarojs/plugin-platform-swan', { backup: require.resolve('@tarojs/plugin-platform-swan') }],
      ['@tarojs/plugin-platform-tt', { backup: require.resolve('@tarojs/plugin-platform-tt') }],
      ['@tarojs/plugin-platform-qq', { backup: require.resolve('@tarojs/plugin-platform-qq') }],
      ['@tarojs/plugin-platform-jd', { backup: require.resolve('@tarojs/plugin-platform-jd') }],

      // commands
      path.resolve(__dirname, 'commands', 'build.js'),
      path.resolve(__dirname, 'commands', 'init.js'),
      path.resolve(__dirname, 'commands', 'config.js'),
      path.resolve(__dirname, 'commands', 'create.js'),
      path.resolve(__dirname, 'commands', 'info.js'),
      path.resolve(__dirname, 'commands', 'doctor.js'),
      path.resolve(__dirname, 'commands', 'convert.js'),
      path.resolve(__dirname, 'commands', 'update.js'),
      path.resolve(__dirname, 'commands', 'inspect.js'),

      // files
      path.resolve(__dirname, 'files', 'writeFileToDist.js'),
      path.resolve(__dirname, 'files', 'generateProjectConfig.js'),
      path.resolve(__dirname, 'files', 'generateFrameworkInfo.js'),

      // frameworks
      ['@tarojs/plugin-framework-react', { backup: require.resolve('@tarojs/plugin-framework-react') }],
      ['@tarojs/plugin-framework-vue2', { backup: require.resolve('@tarojs/plugin-framework-vue2') }],
      ['@tarojs/plugin-framework-vue3', { backup: require.resolve('@tarojs/plugin-framework-vue3') }]
    ]
  }
}
