import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import handleUploadFile from './uploadFile'
import handleDownloadFile from './downloadFile'
import handleRequest from './request'


interface IFileInfo {
  name: string
  url: string
}

interface IRequestArgs {
  url: string
  data?: Record<string, TaroAny>
  header?: Record<string, string>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT'
  dataType?: 'json' | 'text' | 'html'
  timeout?: number
  responseType?: 'text' | 'arraybuffer'
  files: IFileInfo[]
  filePath: string
  success?: (res: TaroAny) => void
  fail?: (err: TaroAny) => void
  complete?: () => void
}

export function handleNetwork(option: IEtsMethodsOptions) {
  const name = option.name

  if (!name) {
    return
  }

  try {
    switch (option.name) {
      case 'request': {
        const task = handleRequest(option)
        option?.onInit?.(task)
        break
      }
      case 'uploadFile': {
        const task = handleUploadFile(option)
        option?.onInit?.(task)
        break
      }
      case 'downloadFile': {
        const task = handleDownloadFile(option)
        option?.onInit?.(task)
        break
      }
      default:
        console.error(`Error(TaroETS): cannot found ${option.type} ${option.name} in ${option.scope} scope.`)
    }
  } catch (e) {}
}

