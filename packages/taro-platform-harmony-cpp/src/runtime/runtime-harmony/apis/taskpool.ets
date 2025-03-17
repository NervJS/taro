import { taskpool } from '@kit.ArkTS'
import fs from '@ohos.file.fs';
import image from '@ohos.multimedia.image';
import type { TaroAny } from '@tarojs/runtime'
import type { IEtsMethodsOptions } from '../index'

@Concurrent
function stringify (data: TaroAny) {
  return JSON.stringify(data)
}

function handleTaskPoolStringify (option: IEtsMethodsOptions) {
  const args: TaroAny = option.args

  if (args) {
    const data: TaroAny = args[0]

    taskpool.execute(stringify, data)
      .then(res => {
        option.successHandler && option.successHandler({ data: res })
      })
      .catch((error: TaroAny) => {
        option.errorHandler && option.errorHandler({
          errCode: error?.code,
          errMsg: error?.message,
          data: error?.data,
        })
      })
  }
}

@Concurrent
function compressImage(data: Record<string, TaroAny>) {

  const src = data[0] as string
  const quality = (data[1] ?? 80) as number
  const compressedWidth = data[2] as number
  const compressedHeight = data[3] as number
  const file = fs.openSync(src, fs.OpenMode.READ_ONLY);

  const source = image.createImageSource(file.fd)

  if (null === (source)) {
    throw new Error('compressImage fail: createImageSource has failed')
    return;
  }
  const width = source.getImageInfoSync().size.width;
  const height = source.getImageInfoSync().size.height;
  let wantWidth = compressedWidth || compressedHeight || 0;
  let wantHeight = compressedHeight || compressedWidth || 0;
  if (width > wantWidth || height > wantHeight) {
    const heightRatio = height / wantHeight;
    const widthRatio = width / wantWidth;
    const finalRatio = heightRatio < widthRatio ? heightRatio : widthRatio;
    wantWidth = Math.round(width / finalRatio);
    wantHeight = Math.round(height / finalRatio);
  }

  try {
    const pixelMap = source.createPixelMapSync({
      editable: true,
      desiredPixelFormat: image.PixelMapFormat.RGBA_8888,
      desiredSize: { width: wantWidth, height: wantHeight },
    })
    fs.closeSync(file);
    return pixelMap
  } catch (e) {
    fs.closeSync(file);
    throw new Error("createPixelMapSync error: ")
  } 


}

function handleTaskPoolCompressImage(option: IEtsMethodsOptions) {

  taskpool.execute(compressImage, option.args as Record<string, TaroAny>)
    .then(res => {
      option?.successHandler?.(res)
    })
    .catch((error: TaroAny) => {
      option?.errorHandler?.({
        errCode: error?.code,
        errMsg: error,
        data: error?.data,
      })
    })

}


@Concurrent
function getImageSize(uri: string) {
  const file = fs.openSync(uri, fs.OpenMode.READ_ONLY);
  const stat = fs.statSync(file.fd);
  const size = stat.size;
  fs.closeSync(file);
  return size
}

function handleTaskPoolGetImageSize(option: IEtsMethodsOptions) {
  const args: TaroAny = option.args

  if (args) {
    const data: TaroAny = args[0]

    taskpool.execute(getImageSize, data)
      .then(res => {
        option.successHandler && option.successHandler({ data: res })
      })
      .catch((error: TaroAny) => {
        option.errorHandler && option.errorHandler({
          errCode: error?.code,
          errMsg: error?.message,
          data: error?.data,
        })
      })
  }
}


export function handleTaskPool(option: IEtsMethodsOptions) {
  const name = option.name

  if (!name) {
    return
  }

  try {
    switch (option.name) {
      case 'stringify':
        handleTaskPoolStringify(option)
        break
      case 'compressImage':
        handleTaskPoolCompressImage(option)
        break
      case 'getImageSize':
        handleTaskPoolGetImageSize(option)
        break
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
