import * as ASCF from '@ascf/native-api'

import Taro from '../../../../../taroo/taro/packages/taro/types'
import networkMappings from './ascf-mappings/network.json'


const transformers = {
  normalizeHeaders: (headers: Record<string, any>) => {
    const normalized: Record<string, any> = {}
    Object.keys(headers).forEach(key => {
      normalized[key.toLowerCase()] = headers[key]
    })
    return normalized
  }
}

export function ascRequest(options: Taro.request.Option): Promise<Taro.request.SuccessCallbackResult> {
  const mapping = networkMappings.request
  const ascfParams: Record<string, any> = {}


  Object.entries(mapping).forEach(([taroKey, config]) => {
    const value = (options as any)[taroKey]

    if (value === undefined) {
      if (config.required) {
        throw new Error(`[ASCF] Missing required parameter: ${taroKey}`)
      }
      if (config.default !== undefined) {
        ascfParams[config.ascfParam] = config.default
      }
      return
    }

    let transformedValue = value
    if (config.valueMap) {
      transformedValue = config.valueMap[value] ?? value
    }
    if (config.transform && transformers[config.transform]) {
      transformedValue = transformers[config.transform](value)
    }

    ascfParams[config.ascfParam] = transformedValue
  })

  return ASCF.Network.request(ascfParams).then(res => {
    return {
      data: res.body,
      statusCode: res.status,
      header: res.headers,
      errMsg: 'request:ok'
    }
  })
}


export const ascfApis = {
  connectDevice: (options: { deviceId: string, timeout?: number }) => {
    return ASCF.Device.connect({
      deviceId: options.deviceId,
      timeout: options.timeout || 5000
    })
  }
}
