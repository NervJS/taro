
import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import handleUploadFile from './uploadFile'
import handleDownloadFile from './downloadFile'

import http from '@ohos.net.http'

interface IFileInfo {
  name: string,
  url: string
}

interface IRequestArgs {
  url: string;
  data?: Record<string, TaroAny>;
  header?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
  dataType?: 'json' | 'text' | 'html';
  timeout?: number;
  responseType?: 'text' | 'arraybuffer';
  files: IFileInfo[]
  filePath: string
  success?: (res: TaroAny) => void;
  fail?: (err: TaroAny) => void;
  complete?: () => void;
}

export function handleNetwork(option: IEtsMethodsOptions) {
  const name = option.name

  if (!name) {
    return
  }

  try {
    switch (option.name) {
      case 'request':
        handleRequest(option)
        break
      case 'uploadFile':
        handleUploadFile(option)
        break
      case 'downloadFile':
        handleDownloadFile(option)
        break
      default:
        console.error(`Error(TaroETS): cannot found ${option.type} ${option.name} in ${option.scope} scope.`)
    }
  } catch (e) {

  }
}

function handleRequest(option: IEtsMethodsOptions) {
  const args = (option?.args?.[0] || {}) as IRequestArgs
  const url = args.url;
  const data = args.data;
  const header = args.header;
  const method = args.method;
  const dataType = args.dataType;
  const timeout = args.timeout;
  const responseType = args.responseType;
  const success = args.success;
  const fail = args.fail;
  const complete = args.complete;

  let httpRequestOhos = http.createHttp()


  const requestParamsOHOS: http.HttpRequestOptions = {
    method: convertToRequestMethod(method || 'GET'),
    header,
    extraData: data as TaroAny,
    readTimeout: timeout,
    connectTimeout: timeout
  }

  httpRequestOhos.request(url, requestParamsOHOS).then((requestData) => {
    let resultData: TaroAny = requestData.result
    if (dataType === 'json' && typeof requestData?.result === 'string') {
      try {
        resultData = JSON.parse(requestData.result)
      } catch (e) {
        console.log('请求返回解析异常')
      }
    }

    typeof success === 'function' && success({
      data: resultData,
      statusCode: requestData.responseCode,
      header: requestData.header
    })
    typeof complete === 'function' && complete()
  }).catch((error: TaroAny) => {
    typeof fail === 'function' && fail(error)
    typeof complete === 'function' && complete()
  })
}


function convertToRequestMethod(methodStr: string): http.RequestMethod {
  // 转换为大写以确保匹配成功
  const upperCaseMethod = methodStr ? methodStr.toUpperCase() : '';

  // 检查转换后的字符串是否是有效的RequestMethod值
  if (Object.values(http.RequestMethod).includes(upperCaseMethod as http.RequestMethod)) {
    return upperCaseMethod as http.RequestMethod;
  }

  // 如果没有匹配到，返回默认值GET
  console.warn(`Invalid request method: ${methodStr}, using GET instead`);
  return http.RequestMethod.GET;
}
