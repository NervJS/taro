import { rcp } from '@kit.RemoteCommunicationKit';

// 公共接口定义
interface IGeneralCallbackResult {
  errMsg: string;
}

interface IHeaderCallBackArgs {
  header: Record<string, string>;
}

interface IProgressCallbackArgs {
  progress: number;
}

// 公共方法实现
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
      result[key] = String(value);
    }
  });

  return result;
}

export {
  IGeneralCallbackResult,
  IHeaderCallBackArgs,
  IProgressCallbackArgs,
  convertHeaders
};
