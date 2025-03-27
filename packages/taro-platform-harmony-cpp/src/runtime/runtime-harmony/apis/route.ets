
import type { TaroAny } from '@tarojs/runtime'
import type { IEtsMethodsOptions } from '../index'
import router from '@ohos.router'
import { queryToJson } from '@tarojs/shared'


export function handleRoute (option: IEtsMethodsOptions) {
  const arg: TaroAny = option.args?.[0] || {}

  // 新增 URL 解析逻辑
  const parser = parseURL(arg.url)
  const url = parser[0]
  const params = parser[1]

  try {
    switch (option.name) {
      case 'navigateTo':
        router.push({
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
            option.successHandler?.({ data: {} })
          }
        })
        break
      case 'redirectTo':
        router.replace({
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
            option.successHandler?.({ data: {} })
          }
        })
        break
      case 'navigateBack':
        const delta = arg.delta || 1
        router.back({
          index: delta
        }, (err) => {
          if (err) {
            option.errorHandler?.({
              errCode: err.code,
              errMsg: err.message,
              data: err.data
            })
          } else {
            option.successHandler?.({ data: {} })
          }
        })
        break
      case 'switchTab':
        router.replace({
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
            option.successHandler?.({ data: {} })
          }
        })
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Unhandled route method: ${option.name}`)
        }
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('Error(TaroETS):', e.message, e)
    if (option.errorHandler) option.errorHandler({
      errCode: e.code,
      errMsg: e.message,
      data: e.data,
    })
  }
}

// 新增 URL 解析函数
function parseURL(raw = ''): [string, Record<string, unknown>] {
  const [urlStr, queryStr = ''] = raw.split('?')
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
