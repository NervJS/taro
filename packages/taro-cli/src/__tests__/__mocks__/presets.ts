import * as path from 'node:path'

export default () => {
  return {
    plugins: [
      // hooks
      path.resolve(__dirname, '../../presets', 'hooks', 'build.ts'),

      // 兼容其他平台小程序插件
      path.resolve(__dirname, '../../presets', 'files', 'writeFileToDist.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateProjectConfig.ts'),
      path.resolve(__dirname, '../../presets', 'files', 'generateFrameworkInfo.ts')
    ]
  }
}
