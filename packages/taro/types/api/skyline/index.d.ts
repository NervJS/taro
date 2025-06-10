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

  /**
   * worklet 对象，可以通过 wx.worklet 获取
   *
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/wx.worklet.html
   */
  interface worklet {
    /**
     * 取消由 SharedValue 驱动的动画
     * @param SharedValue
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/base/worklet.cancelAnimation.html
     */
    cancelAnimation(SharedValue: worklet.SharedValue): void
    /**
     * 衍生值 DerivedValue，可基于已有的 SharedValue 生成其它共享变量。
     * @param updaterWorklet
     * @returns 返回 DerivedValue 类型值，可被 worklet 函数捕获。DerivedValue 也是 SharedValue 类型。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/base/worklet.derived.html
     */
    derived(updaterWorklet: worklet.WorkletFunction): worklet.DerivedValue
    /**
     * ScrollView 实例，可在 worklet 函数内操作 scroll-view 组件。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/base/worklet.scrollViewContext.html
     */
    scrollViewContext: {
      /**
       * 滚动至指定位置
       * @param object
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/base/worklet.scrollViewContext.scrollTo.html
       */
      scrollTo(NodesRef: TaroGeneral.IAnyObject, object: worklet.scrollViewContext.Option): void
    }
    /**
     * 创建共享变量 SharedValue，用于跨线程共享数据和驱动动画。
     * @param initialValue
     * @returns 返回 SharedValue 类型值，可被 worklet 函数捕获。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/base/worklet.shared.html
     */
    shared(initialValue: number | string | bool | null | undefined | Object | Array | Function): worklet.SharedValue
    /**
     * 基于滚动衰减的动画。
     * @param options 动画配置
     * @param callback 动画完成回调。动画被取消时，返回 fasle，正常完成时返回 true。
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.decay.html
     */
    decay(options?: worklet.decay.Option, callback?: (flag: boolean) => void): worklet.AnimationObject
    Easing: worklet.Easing
    /**
     * 基于物理的动画。
     * @param toValue 目标值
     * @param options 动画配置
     * @param callback 动画完成回调。动画被取消时，返回 fasle，正常完成时返回 true。
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.spring.html
     */
    spring(toValue: number | string, options?: worklet.spring.Option, callback?: (flag: boolean) => void): worklet.AnimationObject
    /**
     * 基于时间的动画。
     * @param toValue 目标值
     * @param options 动画配置
     * @param callback 动画完成回调。动画被取消时，返回 fasle，正常完成时返回 true。
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.timing.html
     */
    timing(toValue: number | string, options?: worklet.timing.Option, callback?: (flag: boolean) => void): worklet.AnimationObject
    /**
     * 延迟执行动画。
     * @param delayMS 动画开始前等待的时间，单位：毫秒
     * @param delayedAnimation 动画对象
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/combine-animation/worklet.delay.html
     */
    delay(delayMS: number, delayedAnimation: worklet.AnimationObject): worklet.AnimationObject
    /**
     * 重复执行动画。
     * @param animation 动画对象
     * @param numberOfReps 重复次数。为负值时一直循环，直到被取消动画。
     * @param reverse 反向运行动画，每周期结束动画由尾到头运行。该字段仅对 timing 和 spring 返回的动画对象生效。
     * @param callback 动画完成回调。动画被取消时，返回 fasle，正常完成时返回 true。
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/combine-animation/worklet.repeat.html
     */
    repeat(delayedAnimation: worklet.AnimationObject, numberOfReps: number, reverse?: boolean, callback?: (flag: boolean) => void): worklet.AnimationObject
    /**
     * 组合动画序列，依次执行传入的动画。
     * @param animation 动画对象
     * @returns 返回 AnimationObject 类型值，可直接赋值给 SharedValue。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/combine-animation/worklet.sequence.html
     */
    sequence(...delayedAnimation: worklet.AnimationObject): worklet.AnimationObject
    /**
     * worklet 函数运行在 UI 线程时，捕获的外部函数可能为 worklet 类型或普通函数，为了更明显的对其区分，要求必须使用 runOnJS 调回 JS 线程的普通函数。 有这样的要求是因为，调用其它 worklet 函数时是同步调用，但在 UI 线程执行 JS 线程的函数只能是异步，开发者容易混淆，试图同步获取 JS 线程的返回值。
     * @param fn worklet 类型函数
     * @returns runOnJS 为高阶函数，返回一个函数，执行时运行在 JS 线程
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/tool-function/worklet.runOnJS.html
     */
    runOnJS(fn: TaroGeneral.TFunc): TaroGeneral.TFunc
    /**
     * 在 UI 线程执行 worklet 函数
     * @param fn worklet 类型函数
     * @returns runOnUI 为高阶函数，返回一个函数，执行时运行在 UI 线程
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/tool-function/worklet.runOnUI.html
     */
    runOnUI(fn: TaroGeneral.TFunc): TaroGeneral.TFunc
  }

  namespace worklet {
    type SharedValue = TaroGeneral.IAnyObject
    type DerivedValue = worklet.SharedValue
    type AnimationObject = TaroGeneral.IAnyObject
    type WorkletFunction = TaroGeneral.TFunc

    namespace scrollViewContext {
      interface Option {
        /** 顶部距离 */
        top?: number
        /** 左边界距离 */
        left?: number
        /** 滚动动画时长 */
        duration?: number
        /** 是否启用滚动动画 */
        animated?: boolean
        /** 动画曲线 */
        easingFunction?: string
      }
    }

    namespace decay {
      interface Option {
        /** 初速度 */
        velocity?: number
        /** 衰减速率 */
        deceleration?: number
        /** 边界值，长度为 2 的数组 */
        clamp?: Array<number>
      }
    }

    interface Easing {
      /**
       * 简单的反弹效果
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      bounce(t: number): any;
      /**
       * 简单的惯性动画
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      ease(t: number): any;
      /**
       * 简单的弹性动画，类似弹簧来回摆动，高阶函数。默认弹性为 1，会稍微超出一次。弹性为 0 时 不会过冲
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      elastic(bounciness?: number): any;
      /**
       * 线性函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      linear(t: number): any;
      /**
       * 二次方函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      quad(t: number): any;
      /**
       * 立方函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      cubic(t: number): any;
      /**
       * 高阶函数，返回幂函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      poly(n: number): any;
      /**
       * 三次贝塞尔曲线，效果同 css transition-timing-function
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      bezier(x1: number, y1: number, x2: number, y2: number): any;
      /**
       * 圆形曲线
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      circle(t: number): any;
      /**
       * 正弦函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      sin(t: number): any;
      /**
       * 指数函数
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      exp(t: number): any;
      /**
       * 正向运行 easing function，高阶函数。
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      in(easing: (t: number) => any): any;
      /**
       * 反向运行 easing function，高阶函数。
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      out(easing: (t: number) => any): any;
      /**
       * 前半程正向，后半程反向，高阶函数。
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/animation/worklet.Easing.html
       */
      inOut(easing: (t: number) => any): any;
    }

    namespace spring {
      interface Option {
        /** 阻尼系数 */
        damping?: number
        /** 重量系数，值越大移动越慢 */
        mass?: number
        /** 弹性系数 */
        stiffness?: number
        /** 动画是否可以在指定值上反弹 */
        overshootClamping?: boolean
        /** 弹簧静止时的位移 */
        restDisplacementThreshold?: number
        /** 弹簧静止的速度 */
        restSpeedThreshold?: number
        /** 速度 */
        velocity?: number
      }
    }

    namespace timing {
      interface Option {
        /** 动画时长 */
        duration?: number
        /** 动画曲线 */
        easing?: (t: number) => number
      }
    }
  }

  interface TaroStatic {
    worklet: worklet
  }
}
