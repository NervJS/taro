
import type { TaroAny } from '../../../../../runtime'
import type { IEtsMethodsOptions } from '../index'
import router from '@ohos.router'
import { queryToJson } from '../../../../../shared'


export function handleRoute (option: IEtsMethodsOptions) {
  const arg: TaroAny = option.args?.[0] || {}

  // 新增 URL 解析逻辑
  const parser = parseURL(arg.url)
  const url = parser[0]
  const params = parser[1]

  try {
    switch (option.name) {
      case 'navigateTo':
        router.pushUrl({
          url: url,
          params: params
        }, (err) => {
          if (err) {
            option.errorHandler?.({
              errCode: err.code,
              errMsg: err.message,
              data: err.data
            })
          } else {
            option.successHandler?.()
          }
        })
        break
      case 'redirectTo':
        router.replaceUrl({
          url: url,
          params: params
        }, (err) => {
          if (err) {
            option.errorHandler?.({
              errCode: err.code,
              errMsg: err.message,
              data: err.data
            })
          } else {
            option.successHandler?.()
          }
        })
        break
      case 'navigateBack':
        if (!url) {
          router.back()
        } else {
          router.back({ url })
        }
        option.successHandler?.()
        break
      case 'switchTab':
        router.replaceUrl({
          url: url,
          params: params
        }, (err) => {
          if (err) {
            option.errorHandler?.({
              errCode: err.code,
              errMsg: err.message,
              data: err.data
            })
          } else {
            option.successHandler?.()
          }
        })
        break
      default:
        if (("development" as string) !== 'production') {
          console.warn(`Unhandled route method: ${option.name}`)
        }
    }
  } catch (e) {
    if (("development" as string) !== 'production') console.error('Error(TaroETS):', e.message, e)
    if (option.errorHandler) option.errorHandler({
      errCode: e.code,
      errMsg: e.message,
      data: e.data,
    })
  }
}

// 新增 URL 解析函数
function parseURL(raw = ''): [string, Record<string, TaroAny>] {
  // const [urlStr, queryStr = ''] = raw.split('?')
  const splitRaw = raw.split('?')
  const urlStr = splitRaw[0] || ''
  const queryStr = splitRaw[1] || ''
  const query = queryToJson(queryStr)
  let url = urlStr.replace(/^\//, '')

  // 处理相对路径逻辑
  if (url.indexOf('.') === 0) {
    const currentPage = router.getState()
    const parts = currentPage.path.split('/')
    parts.pop()
    url.split('/').forEach((item) => {
      item === '..' ? parts.pop() : parts.push(item)
    })
    url = parts.join('/')
  }

  return [url, query]
}
