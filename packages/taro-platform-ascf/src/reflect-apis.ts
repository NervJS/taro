import { processApis } from '@tarojs/shared'

/**
 * 在调用Taro.xxx(key)时，映射到has.xxxx(value)
 * 如：Taro.navigateToMiniProgram()，实际执行的是has.navigateToAtomicService()
 */
const reflectApisMap: Map<string, string> = new Map([
  ['navigateToMiniProgram', 'navigateToAtomicService'],
  ['navigateBackMiniProgram', 'navigateBackAtomicService']
])

const needPromiseApis = new Set(reflectApisMap.keys())

export function reflectApis (taro, has) {
  processApis(taro, has, {
    needPromiseApis,
    isOnlyPromisify: true,
    transformMeta (api: string, options: Record<string, any>) {
      return {
        options,
        key: reflectApisMap.get(api) || api,
      }
    }
  })
}
