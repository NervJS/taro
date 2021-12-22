import Taro from '@tarojs/api'
import { findDOM } from '../utils'
import { MethodHandler } from '../utils/handler'

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
 * @todo 暂未支持尺寸相关功能
 */
export const canvasToTempFilePath: typeof Taro.canvasToTempFilePath = ({ canvasId, fileType, quality, success, fail, complete }, inst) => {
  const handle = new MethodHandler({ name: 'canvasToTempFilePath', success, fail, complete })
  const el = findDOM(inst) as HTMLElement
  const canvas = el?.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement

  try {
    const dataURL = canvas?.toDataURL(`image/${fileType || 'png'}`, quality)
    return handle.success({
      tempFilePath: dataURL
    })
  } catch (e) {
    return handle.fail({
      errMsg: e.message
    })
  }
}
