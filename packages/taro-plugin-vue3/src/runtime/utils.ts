import { chalk } from '@tarojs/helper'
import { Current } from '@tarojs/runtime'

/**
 * set writable, enumerable to true
 */
export function setDefaultDescriptor (obj: Record<string, any>) {
  obj.writable = true
  obj.enumerable = true
  return obj
}

/**
 * 设置入口的路由参数
 * @param options 小程序传入的参数
 */
export function setRouterParams (options) {
  Current.router = {
    params: options?.query,
    ...options
  }
}

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
