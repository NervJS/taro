
import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '../../../../../../runtime'

import { rcp } from '@kit.RemoteCommunicationKit';
import fs from '@ohos.file.fs';

// 新增公共模块引用
import {
  IGeneralCallbackResult,
  IHeaderCallBackArgs,
  IProgressCallbackArgs,
  convertHeaders
} from './common';


interface IDownloadTask {
  abort: () => void;
  onProgressUpdate: (callback: (res: IProgressCallbackArgs) => void) => void;
  offProgressUpdate: (callback?: (res: IProgressCallbackArgs) => void) => void;
  onHeadersReceived: (callback: (res: IHeaderCallBackArgs) => void) => void;
  offHeadersReceived: (callback?: (res:IHeaderCallBackArgs) => void) => void;
}

interface IDownloadSuccessCallbackResult {
  tempFilePath: string;
  filePath?: string;
  statusCode: number;
  header: Record<string, string>;
  errMsg: string;
}


interface IDownloadOptions {
  url: string;
  header?: Record<string, string>;
  filePath?: string; // 指定文件下载后存储的路径
  timeout?: number;
  success?: (res: IDownloadSuccessCallbackResult) => void;
  fail?: (res: IGeneralCallbackResult) => void;
  complete?: (res: IGeneralCallbackResult) => void;
}

/**
 * 生成默认的临时文件路径
 */
function getDefaultTempFilePath(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const fileName = `download_${timestamp}_${randomStr}`
  const context = getContext();
  const applicationContext = context.getApplicationContext();
  const tempDir = applicationContext.tempDir;
  const filePath = `${tempDir}/${fileName}`;
  // try {
  //   const res = fs.accessSync(filePath);
  //   if (res) {
  //     // 如果图片afterCompressiona.jpeg已存在，则删除
  //     fs.unlinkSync(filePath);
  //   }
  // }catch (e){
  //
  // } finally {
  //   fs.mkdirSync(filePath)
  // }

  return filePath;
}

export default function handleDownloadFileRcp(optionss: IEtsMethodsOptions): IDownloadTask {
  const option = (optionss?.args?.[0] || {}) as IDownloadOptions

  // 创建一个RCP会话
  const session = rcp.createSession();

  // 创建一个request对象
  const request = new rcp.Request(option.url, 'GET');

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

  let progressCallbacks: Array<(res: IProgressCallbackArgs) => void> = [];
  let headersCallbacks: Array<(res: IHeaderCallBackArgs) => void> = [];

  // 设置事件处理器
  if (request.configuration) {
    const tracingConfig = request.configuration.tracing ??= {};
    const httpEvents = tracingConfig.httpEventsHandler ??= {};

    httpEvents.onDownloadProgress = (totalSize, transferredSize) => {
      const progress = Math.floor((transferredSize / totalSize) * 100);
      // 触发所有进度回调
      progressCallbacks.forEach(callback => {
        callback({ progress });
      });
    };

    httpEvents.onHeaderReceive = (headers: rcp.ResponseHeaders) => {
      const converted: IHeaderCallBackArgs = { header: convertHeaders(headers) };
      // 触发所有头部回调
      headersCallbacks.forEach(callback => {
        callback(converted);
      });
    };
  }

  // 设置文件下载路径
  let downloadPath = option.filePath || getDefaultTempFilePath();

  // 设置下载目标
  let downloadTo: rcp.DownloadToFile = {
    kind: 'file',
    file: downloadPath,
    keepLocal: true
  };

  request.destination = downloadTo;

  // 发起请求并处理响应
  session.fetch(request)
    .then(response => {
      let filePath = downloadPath;
      let originalFileName = '';

      // 如果有downloadedTo信息，使用实际下载路径
      if (response.downloadedTo && response.downloadedTo.path) {
        filePath = response.downloadedTo.path;
      }


      // 如果用户没有指定文件路径，尝试添加适当的扩展名
      if (!option.filePath) {
        // 获取原始文件名
        const originalFileName = getOriginalFileName(response, option.url);

        // 确保文件有正确的扩展名
        filePath = ensureFileExtension(filePath, originalFileName, response);
      }

      const result: IDownloadSuccessCallbackResult = {
        tempFilePath: filePath,
        filePath: filePath,
        statusCode: response.statusCode,
        header: convertHeaders(response.headers),
        errMsg: 'downloadFile:ok'
      };

      if (option.success) {
        option.success(result);
      }

      if (option.complete) {
        option.complete({
          errMsg: 'downloadFile:ok'
        });
      }

      return result;
    })
    .catch((error: TaroAny) => {
      const errMsg = `downloadFile:fail ${error.message || ''}`;

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

    });

  // 返回任务对象
  const downloadTask: IDownloadTask = {
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

  return downloadTask;
}

/**
 * 从URL中提取文件名
 */
function getFileNameFromUrl(url: string): string {
  // 去除查询参数
  const urlWithoutParams = url.split('?')[0];
  // 取最后一段作为文件名
  const segments = urlWithoutParams.split('/');
  const fileName = segments[segments.length - 1];

  // 如果有文件名，返回；否则返回空字符串
  return fileName || '';
}

/**
 * 从Content-Type推断文件扩展名
 */
function getExtensionFromContentType(contentType: string): string {
  if (!contentType) return '';

  // 基于常见MIME类型映射扩展名
  if (contentType.includes('image/jpeg')) return '.jpg';
  if (contentType.includes('image/png')) return '.png';
  if (contentType.includes('image/gif')) return '.gif';
  if (contentType.includes('image/webp')) return '.webp';
  if (contentType.includes('text/plain')) return '.txt';
  if (contentType.includes('text/html')) return '.html';
  if (contentType.includes('application/pdf')) return '.pdf';
  if (contentType.includes('application/json')) return '.json';
  if (contentType.includes('application/zip')) return '.zip';

  return '';
}

/**
 * 从多个来源尝试获取原始文件名
 */
function getOriginalFileName(response: rcp.Response, url: string): string {
  // 1. 从Content-Disposition header获取
  if (response.headers && response.headers['content-disposition']) {
    const contentDisposition = response.headers['content-disposition'] as string;
    const filenameMatch = /filename=["']?([^"';\n]+)["']?/i.exec(contentDisposition);

    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }
  }

  // 2. 从URL中提取
  return getFileNameFromUrl(url);
}

/**
 * 从文件名中提取文件扩展名
 */
function getFileExtension(filename: string): string {
  const extMatch = filename.match(/\.([^./\\]+)$/);
  if (extMatch && extMatch[1]) {
    return '.' + extMatch[1].toLowerCase();
  }
  return '';
}


/**
 * 为文件添加适当的扩展名
 */
function ensureFileExtension(filePath: string, originalFileName: string, response: rcp.Response): string {
  // 如果文件已有扩展名，检查是否需要更新
  const currentExt = getFileExtension(filePath);

  // 从原始文件名获取扩展名
  const originalExt = getFileExtension(originalFileName);

  // 如果原始文件有扩展名
  if (originalExt) {
    // 如果当前文件没有扩展名或扩展名不同
    if (!currentExt || currentExt.toLowerCase() !== originalExt.toLowerCase()) {
      const filePathBase = currentExt ? filePath.substring(0, filePath.length - currentExt.length) : filePath;
      const newFilePath = filePathBase + originalExt;

      try {
        fs.renameSync(filePath, newFilePath);
        return newFilePath;
      } catch (e) {
        console.error('Failed to update file extension:', e);
      }
    }
    return filePath; // 如果扩展名相同或重命名失败，返回原路径
  }

  // 如果文件仍然没有扩展名，尝试从Content-Type推断
  if (!currentExt && response.headers && response.headers['content-type']) {
    const contentTypeExt = getExtensionFromContentType(response.headers['content-type']);

    if (contentTypeExt) {
      const newFilePath = filePath + contentTypeExt;
      try {
        fs.renameSync(filePath, newFilePath);
        return newFilePath;
      } catch (e) {
        console.error('Failed to add content-type extension:', e);
      }
    }
  }

  return filePath; // 如果无法添加扩展名，返回原路径
}
