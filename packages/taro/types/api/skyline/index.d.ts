import Taro from '../../index'

declare module '../../index' {
  /**
   * Snapshot 实例，可通过 SelectorQuery 获取。
   *
   * Snapshot 通过 id 跟一个 snapshot 组件绑定，操作对应的 snapshot 组件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/skyline/Snapshot.html
   */
  interface Snapshot {
    /**
     * 画布宽度
     */
    width: number
    /**
     * 画布高度
     */
    height: number
    /**
     * 对 snapshot 组件子树进行截图
     * @param option
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/skyline/Snapshot.takeSnapshot.html
     */
    takeSnapshot(option: Snapshot.TakeSnapshot.Option): Promise<TaroGeneral.CallbackResult>
  }

  namespace Snapshot {
    namespace TakeSnapshot {
      interface Option {
        /**
         * 截图导出类型，'file' 保存到临时文件目录或 'arraybuffer' 返回图片二进制数据，默认值为 'file'
         */
        type: string
        /**
         * 截图文件格式，'rgba' 或 'png'，默认值为 'png'
         */
        format: string
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: SuccessCallbackResult) => void
      }

      interface SuccessCallbackResult {
        /**
         * 截图保存的临时文件路径，当 type 为 file 该字段生效
         */
        tempFilePath: string
        /**
         * 截图对应的二进制数据，当 type 为 arraybuffer 该字段生效
         */
        data: string
      }
    }
  }

  /**
   * DraggableSheet 实例，可通过 Taro.createSelectorQuery 的 NodesRef.node 方法获取。
   *
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/skyline/DraggableSheetContext.html
   */
  interface DraggableSheetContext {
    /**
     * 滚动到指定位置。size 取值 [0, 1]，size = 1 时表示撑满 draggable-sheet 组件。size 和 pixels 同时传入时，仅 size 生效。
     * @param option
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/skyline/DraggableSheetContext.scrollTo.html
     */
    scrollTo(option: DraggableSheetContext.scrollTo.Option): void
  }

  namespace DraggableSheetContext {
    namespace scrollTo {
      interface Option {
        /** 相对目标位置 */
        size?: number
        /** 绝对目标位置 */
        pixels?: number
        /**
         * 是否启用滚动动画
         * @default true
         */
        animated?: boolean
        /**
         * 滚动动画时长（ms)
         * @default 300
         */
        duration?: number
        /**
         * 缓动函数
         * @default ease
         */
        easingFunction?: string
      }
    }
  }
}
