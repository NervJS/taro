import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import { rcp } from '@kit.RemoteCommunicationKit';
import { url, util } from '@kit.ArkTS';

import {
  IGeneralCallbackResult,
  IHeaderCallBackArgs,
  convertHeaders
} from './common';


interface IChunkCallBackArgs { data: ArrayBuffer }

interface IRequestTask {
  abort: () => void;
  onHeadersReceived: (callback: (res: IHeaderCallBackArgs) => void) => void;
  offHeadersReceived: (callback?: (res: IHeaderCallBackArgs) => void) => void;
  onChunkReceived: (callback: (res: IChunkCallBackArgs) => void) => void;
  offChunkReceived: (callback?: (res: IChunkCallBackArgs) => void) => void;
}

interface ISuccessCallbackResult {
  data: TaroAny;
  statusCode: number;
  header: Record<string, string>;
  errMsg: string;
}

interface IRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  data?: TaroAny;
  header?: Record<string, string>;
  timeout?: number;
  dataType?: 'json' | 'text';
  success?: (res: ISuccessCallbackResult) => void;
  fail?: (res: IGeneralCallbackResult) => void;
  complete?: (res: IGeneralCallbackResult) => void;
}

export default function handleRequestRcp(optionss: IEtsMethodsOptions): IRequestTask {
  const option = (optionss?.args?.[0] || {}) as IRequestOptions

  const session = rcp.createSession();
  const method = (option.method || 'GET').toUpperCase() as rcp.HttpMethod;
  const request = new rcp.Request(option.url, method);

  // 设置请求配置
  if (option.timeout) {
    request.configuration = {
      transfer: {
        timeout: {
          transferMs: option.timeout
        }
      }
    };
  }

  // 设置请求头
  request.headers = option.header || {};

  // 处理请求数据
  if (option.data) {
    if (method === 'GET') {
      // GET 请求处理查询参数
      const params = new url.URLParams();
      Object.keys(option.data).forEach(key => {
        params.append(key, option.data![key]);
      });
      request.url.search = params.toString();
    } else {
      // 处理 POST/PUT 等请求体
      const contentType = request.headers?.['Content-Type'] || 'application/json';

      if (typeof option.data === 'string') {
        request.content = option.data;
      } else if (option.data instanceof ArrayBuffer) {
        request.content = option.data;
      } else {
        // 对象类型数据序列化
        request.content = contentType.includes('json')
          ? JSON.stringify(option.data)
          : new url.URLParams();
        (option.data).toString();
      }

      // 设置内容类型头
      if (!request.headers?.['Content-Type']) {
        request.headers['Content-Type'] = contentType;
      }
    }
  }

  // 事件处理器配置
  let chunkCallbacks: Array<(res: IChunkCallBackArgs) => void> = [];
  let headersCallbacks: Array<(res: IHeaderCallBackArgs) => void> = [];
  let responseBuffer: ArrayBuffer[] = []; // 新增缓冲区存储分块数据

  if (request.configuration) {
    const tracingConfig = request.configuration.tracing ??= {};
    const httpEvents = tracingConfig.httpEventsHandler ??= {};

    httpEvents.onHeaderReceive = (headers: rcp.ResponseHeaders) => {
      const converted: IHeaderCallBackArgs = {
        header: convertHeaders(headers)
      };
      headersCallbacks.forEach(callback => callback(converted));
    };

    // 添加分块数据接收处理
    httpEvents.onDataReceive = (incomingData: ArrayBuffer) => {
      // 新增分块数据缓冲
      responseBuffer.push(incomingData);

      chunkCallbacks.forEach(callback => {
        const res: IChunkCallBackArgs = { data: incomingData }
        callback(res);
      });
      return incomingData.byteLength;
    };
  }

  // 发起请求
  session.fetch(request)
    .then(response => {
      let responseData: TaroAny;

      // 处理响应数据（改为使用缓冲数据）
      if (responseBuffer.length > 0) {
        const totalLength = responseBuffer.reduce((sum, buf) => sum + buf.byteLength, 0);
        const mergedBuffer = new Uint8Array(totalLength);
        let offset = 0;

        responseBuffer.forEach(buf => {
          mergedBuffer.set(new Uint8Array(buf), offset);
          offset += buf.byteLength;
        });

        // 处理分块编码（示例响应中包含 chunked 数据）
        const rawData = new util.TextDecoder().decodeToString(mergedBuffer);
        const cleanedData = rawData.replace(/^b\r\n|\r\n0$/, ''); // 移除chunked头尾

        if (option.dataType === 'json') {
          try {
            responseData = JSON.parse(rawData);
          } catch (e) {
            console.warn('JSON parse failed:', e);
            responseData = rawData;
          }
        } else {
          responseData = cleanedData; // 直接使用处理后的字符串
        }
      }

      const result: ISuccessCallbackResult = {
        data: responseData,
        statusCode: response.statusCode,
        header: convertHeaders(response.headers),
        errMsg: 'request:ok'
      };

      option.success?.(result);
      option.complete?.({
        errMsg: 'request:ok'
      });
      return result;
    })
    .catch((error: TaroAny) => {
      const errMsg = `request:fail ${error.message || ''}`;
      option.fail?.({
        errMsg
      });
      option.complete?.({
        errMsg
      });
    });

  // 返回任务对象
  const requestTask: IRequestTask = {
    abort: () => session.cancel(request),
    onHeadersReceived: (callback) => {
      headersCallbacks.push(callback);
    },
    offHeadersReceived: (callback?) => {
      if (callback) {
        headersCallbacks = headersCallbacks.filter(cb => cb !== callback);
      } else {
        headersCallbacks = [];
      }
    },
    onChunkReceived: (callback) => {
      chunkCallbacks.push(callback);
    },
    offChunkReceived: (callback?) => {
      if (callback) {
        chunkCallbacks = chunkCallbacks.filter(cb => cb !== callback);
      } else {
        chunkCallbacks = [];
      }
    }
  };

  return requestTask;
}
