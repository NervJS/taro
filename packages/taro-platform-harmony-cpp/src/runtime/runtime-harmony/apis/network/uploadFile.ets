import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import { rcp } from '@kit.RemoteCommunicationKit';
import { util } from '@kit.ArkTS';

interface ICallbackArgs { progress: number }

interface IUploadTask {
  abort: () => void;
  onProgressUpdate: (callback: (res: ICallbackArgs) => void) => void;
}

interface ISuccessCallbackResult {
  data: string;
  statusCode: number;
  header: Record<string, string>;
  errMsg: string;
}

interface WxGeneralCallbackResult {
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
  fail?: (res: WxGeneralCallbackResult) => void;
  complete?: (res: WxGeneralCallbackResult) => void;
}

function convertHeaders(headers: rcp.ResponseHeaders): Record<string, string> {
  const result: Record<string, string> = {};

  if (!headers) {
    return result;
  }

  Object.keys(headers).forEach(key => {
    const value = headers[key];
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
    } else if (value !== undefined) {
      result[key] = value;
    }
  });

  return result;
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

  // 用于保存进度回调
  let progressCallback: ((res: ICallbackArgs) => void) | null = null;

  // 设置上传进度监听
  if (request.configuration) {
    if (request.configuration && request.configuration.tracing) {
      request.configuration.tracing.httpEventsHandler = {
        onUploadProgress: (totalSize, transferredSize) => {
          if (progressCallback) {
            const progress = Math.floor((transferredSize / totalSize) * 100);
            progressCallback({
              progress
            });
          }
        }
      };
    } else {
      request.configuration.tracing = {
        httpEventsHandler: {
          onUploadProgress: (totalSize, transferredSize) => {
            if (progressCallback) {
              const progress = Math.floor((transferredSize / totalSize) * 100);
              progressCallback({
                progress
              });
            }
          }
        }
      }

    }
  }


  // 发起请求并处理响应
  const fetchPromise = session.fetch(request)
    .then(response => {
      const result: ISuccessCallbackResult = {
        data: response.body ? new util.TextDecoder().decode(new Uint8Array(response.body)) : '',
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

  const uploadTask: IUploadTask = {
    abort: () => {
      session.cancel(request);
    },
    onProgressUpdate: (callback) => {
      progressCallback = callback;
    }
  };

  return uploadTask;
}
