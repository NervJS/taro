import { TaroElement } from '@tarojs/runtime'

import { FunctionType, IAsyncParams } from './types'

export * from './validate'

export function noop () {}

export function unsupport (str: string) {
  return function () {
    process.env.NODE_ENV !== 'production' && console.warn(`暂不支持 Taro.${str}`)
  }
}

export function temporarilyNotSupport (apiName: string, recommended?: string, isSync = true) {
  return () => {
    let errMsg = `暂不支持 API ${apiName}`
    if (recommended) {
      errMsg += `, 请使用 ${recommended}`
    }
    console.error(errMsg)
    const error = new Error(errMsg)

    if (!isSync) {
      return Promise.reject(error)
    } else {
      return error
    }
  }
}

export function callAsyncSuccess<T extends FunctionType> (resolve, res, options?: IAsyncParams<T>) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve(res)
}

export function callAsyncFail<T extends FunctionType> (reject, res, options?: IAsyncParams<T>) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject(res)
}

// 使用深度优先遍历寻找节点树中对应的子节点，且只需要找到第一个
// 通过 selector 判断是 id 还是 selector，从 node 的 id 和 className 属性中寻找
export function findChildNodeWithDFS(node: TaroElement, selector: string, selectAll: true): TaroElement[] | null;
export function findChildNodeWithDFS(node: TaroElement, selector: string, selectAll?: false): TaroElement | null;
export function findChildNodeWithDFS (node: TaroElement, selector: string, selectAll: boolean): TaroElement[] | TaroElement | null;
export function findChildNodeWithDFS (node: TaroElement, selector: string, selectAll): TaroElement[] | TaroElement | null {
  const queue = [node]
  
  const nodeList: TaroElement[] = []
  while (queue.length) {
    const currentNode = queue.shift()
    if (currentNode) {
      if (selector.startsWith('#')) {
        if (currentNode.id === selector.slice(1)) {
          nodeList.push(currentNode)
          if (!selectAll) break
        }
      } else {
        if (currentNode.className?.includes(selector.slice(1))) {
          nodeList.push(currentNode)
          if (!selectAll) break
        }
      }
      
      if (currentNode.childNodes && currentNode.childNodes.length) {
        // @ts-ignore
        queue.push(...currentNode.childNodes)
      }
    }
  }
  
  if (nodeList.length) {
    return selectAll ? nodeList : nodeList[0]
  }

  return null
}
