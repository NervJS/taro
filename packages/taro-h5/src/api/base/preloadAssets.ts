import Taro from '@tarojs/api'

import { shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

type Asset = Taro.preloadAssets.AssetsObject

const requests = new Map<string, Promise<void>>()

function preload ({ type, src }: Asset) {
  const url = new URL(src, document.baseURI).href
  const key = `${type}:${url}`
  const existing = requests.get(key)
  if (existing) return existing

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = type
  link.href = url
  if (type === 'font') link.crossOrigin = 'anonymous'

  const request = new Promise<void>((resolve, reject) => {
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`failed to preload ${type}: ${url}`))
    document.head.appendChild(link)
  }).catch(error => {
    requests.delete(key)
    link.remove()
    throw error
  }).finally(() => {
    link.onload = null
    link.onerror = null
  })
  requests.set(key, request)
  return request
}

export const preloadAssets: typeof Taro.preloadAssets = async options => {
  const name = 'preloadAssets'
  const validation = shouldBeObject(options)
  if (!validation.flag) return new MethodHandler({ name }).fail({ errMsg: validation.msg })

  const { data, success, fail, complete } = options
  const handler = new MethodHandler({ name, success, fail, complete })
  if (!Array.isArray(data) || !Array.from(data).every(asset => asset &&
    (asset.type === 'image' || asset.type === 'font') && typeof asset.src === 'string' && asset.src.trim())) {
    return handler.fail({ errMsg: 'data must be an array of image or font sources' })
  }

  try {
    await Promise.all(data.map(async asset => preload(asset)))
  } catch (error) {
    return handler.fail({ errMsg: error instanceof Error ? error.message : String(error) })
  }
  return handler.success()
}
