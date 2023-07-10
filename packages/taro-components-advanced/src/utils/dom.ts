import { createSelectorQuery } from '@tarojs/taro'

export function getRectSize (id: string, success?: TFunc, fail?: TFunc, retryMs = 500) {
  const query = createSelectorQuery()
  try {
    query.select(id).boundingClientRect((res) => {
      if (res) {
        success?.(res)
      } else {
        fail?.()
      }
    }).exec()
  } catch (err) {
    setTimeout(() => {
      getRectSize(id, success, fail, retryMs)
    }, retryMs)
  }
}

export function getRectSizeSync (id: string, retryMs = 500) {
  return new Promise<{ width?: number, height?: number }>((resolve) => {
    function retry () {
      setTimeout(async () => {
        try {
          const res = await getRectSizeSync(id, retryMs)
          resolve(res)
        } catch (err) {
          retry()
        }
      }, retryMs)
    }
    getRectSize(id, resolve, retry, retryMs)
  })
}

export async function getScrollViewContextNode (id: string) {
  const query = createSelectorQuery()
  return new Promise((resolve) => query.select(id).node(({ node }) => resolve(node)).exec())
}

