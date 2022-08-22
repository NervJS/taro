import { chalk } from '@tarojs/helper'

export function getVueLoaderPath (): string {
  try {
    return require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }
}
