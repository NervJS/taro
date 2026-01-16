import { getEnv, getSystemInfoSync } from '@tarojs/taro'

let sysInfo: ReturnType<typeof getSystemInfoSync>

export const getSysInfo = () => {
  if (sysInfo) return sysInfo
  sysInfo = getSystemInfoSync()
  return sysInfo
}

type ArrIndex = number;
/**
 * 一维数组索引换算到二维数组
 * @param i 一维数组索引
 * @param columns 列数
 */
export function getMatrixPosition(i: ArrIndex, columns: number) {
  const col = i % columns // 列号
  const row = Math.floor(i / columns) // 行号
  return { row, col }
}

/**
 * 简单比较渲染区间范围
 */
export function isSameRenderRange(a: any[], b: any[]) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * 创建一个命令式的 promise 对象
 *
 * 返回的对象包含以下属性：
 * - promise: 一个新的 Promise 对象，初始状态为 pending。
 * - resolve: 一个函数，用于将 promise 状态置为 resolved。
 * - reject: 一个函数，用于将 promise 状态置为 rejected，并可以传递一个原因参数。
 */
export const createImperativePromise = () => {
  type ImperativePromiseHandle = {
    resolve: () => void
    reject: (reason?: any) => void
  };
  const handle = {} as ImperativePromiseHandle
  const promise = new Promise<void>((resolve, reject) => {
    handle.resolve = resolve
    handle.reject = reject
  })
  return {
    ...handle,
    promise,
  }
}

export const isWeb = () => getEnv().toLowerCase() === 'web'
