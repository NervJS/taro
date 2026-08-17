import { createSelectorQuery } from '@tarojs/taro'

export function getRectSize (
  id: string,
  success?: TFunc,
  fail?: TFunc,
  retryMs = 500,
  scope?: object
) {
  const rootQuery = createSelectorQuery()
  const query = scope != null ? rootQuery.in(scope as any) : rootQuery
  try {
    query.select(id).boundingClientRect((res) => {
      if (res instanceof Array ? res.length > 0 : res) {
        success?.(res)
      } else {
        fail?.()
      }
    }).exec()
  } catch (err) {
    setTimeout(() => {
      getRectSize(id, success, fail, retryMs, scope)
    }, retryMs)
  }
}

export function getRectSizeSync (id: string, retryMs = 500, retryTimes = 5, scope?: object) {
  return new Promise<{ width?: number, height?: number }>((resolve) => {
    function retry () {
      if (retryTimes <= 0) return
      setTimeout(async () => {
        try {
          const res = await getRectSizeSync(id, retryMs, --retryTimes, scope)
          resolve(res)
        } catch (err) {
          retry()
        }
      }, retryMs)
    }
    getRectSize(id, resolve, retry, retryMs, scope)
  })
}

export async function getScrollViewContextNode (id: string) {
  const query = createSelectorQuery()
  return new Promise((resolve) => query.select(id).node(({ node }) => resolve(node)).exec())
}
