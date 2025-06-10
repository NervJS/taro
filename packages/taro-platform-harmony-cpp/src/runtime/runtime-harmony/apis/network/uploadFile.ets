import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import { rcp } from '@kit.RemoteCommunicationKit';
import { util } from '@kit.ArkTS';

import {
  IGeneralCallbackResult,
  IHeaderCallBackArgs,
  IProgressCallbackArgs,
  convertHeaders
} from './common';

interface IUploadTask {
  abort: () => void;
  onProgressUpdate: (callback: (res: IProgressCallbackArgs) => void) => void;
  offProgressUpdate: (callback?: (res: IProgressCallbackArgs) => void) => void;
  onHeadersReceived: (callback: (res: IHeaderCallBackArgs) => void) => void;
  offHeadersReceived: (callback?: (res: IHeaderCallBackArgs) => void) => void;
}

interface ISuccessCallbackResult {
  data: string;
  statusCode: number;
  header: Record<string, string>;
  errMsg: string;
}




interface IOptions {
  url: string;
  filePath: string;
  name: string;
  header?: Record<string, string>;
  formData?: Record<string, TaroAny>;
  timeout?: number;
  success?: (res: ISuccessCallbackResult) => void;
  fail?: (res: IGeneralCallbackResult) => void;
  complete?: (res: IGeneralCallbackResult) => void;
}



export default function handleUploadFileRcp(optionss: IEtsMethodsOptions): IUploadTask {
  const option = (optionss?.args?.[0] || {}) as IOptions

  // 创建一个RCP会话
  const session = rcp.createSession();

  // 创建一个request对象
  const request = new rcp.Request(option.url, 'POST');

  // 设置超时
  if (option.timeout) {
    request.configuration = {
      transfer: {
        timeout: {
          transferMs: option.timeout
        }
      }
    };
  }

  // 设置header
  if (option.header) {
    request.headers = option.header;
  }

  // 创建表单数据
  const formFields: rcp.MultipartFormFields = {};

  // 添加formData字段
  if (option.formData) {
    Object.keys(option.formData).forEach(key => {
      formFields[key] = option.formData![key];
    });
  }

  // 添加文件字段
  formFields[option.name] = {
    contentType: 'application/octet-stream',
    remoteFileName: option.filePath.split('/').pop() || 'file',
    contentOrPath: option.filePath
  };

  // 设置请求内容为MultipartForm
  request.content = new rcp.MultipartForm(formFields);

  // 改为使用数组存储回调
  let progressCallbacks: Array<(res: IProgressCallbackArgs) => void> = [];
  let headersCallbacks: Array<(res: IHeaderCallBackArgs) => void> = [];

  // 设置事件处理器
  if (request.configuration) {
    const tracingConfig = request.configuration.tracing ??= {};
    const httpEvents = tracingConfig.httpEventsHandler ??= {};

    httpEvents.onUploadProgress = (totalSize, transferredSize) => {
      const progress = Math.floor((transferredSize / totalSize) * 100);
      progressCallbacks.forEach(callback => {
        callback({
          progress
        });
      });
    };

    httpEvents.onHeaderReceive = (headers: rcp.ResponseHeaders) => {
      const converted: IHeaderCallBackArgs = {
        header: convertHeaders(headers)
      };
      headersCallbacks.forEach(callback => {
        callback(converted);
      });
    };
  }


  // 发起请求并处理响应
  session.fetch(request)
    .then(response => {
      const result: ISuccessCallbackResult = {
        data: response.body ? new util.TextDecoder().decodeToString(new Uint8Array(response.body)) : '',
        statusCode: response.statusCode,
        header: convertHeaders(response.headers),
        errMsg: 'uploadFile:ok'
      };

      if (option.success) {
        option.success(result);
      }

      if (option.complete) {
        option.complete({
          errMsg: 'uploadFile:ok'
        });
      }

      return result;
    })
    .catch((error: TaroAny) => {
      const errMsg = `uploadFile:fail ${error.message || ''}`;

      if (option.fail) {
        option.fail({
          errMsg
        });
      }

      if (option.complete) {
        option.complete({
          errMsg
        });
      }

      // throw error;
    });



  // 返回任务对象
  const uploadTask: IUploadTask = {
    abort: () => {
      session.cancel(request);
    },
    onProgressUpdate: (callback) => {
      progressCallbacks.push(callback);
    },
    offProgressUpdate: (callback?) => {
      if (callback) {
        progressCallbacks = progressCallbacks.filter(cb => cb !== callback);
      } else {
        progressCallbacks = [];
      }
    },
    onHeadersReceived: (callback) => {
      headersCallbacks.push(callback);
    },
    offHeadersReceived: (callback?) => {
      if (callback) {
        headersCallbacks = headersCallbacks.filter(cb => cb !== callback);
      } else {
        headersCallbacks = [];
      }
    }
  };

  return uploadTask;
}
