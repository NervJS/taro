/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import Taro from '../../index'

declare module '../../index' {
  namespace isVKSupport {
    /** vision kit 版本 */
    interface Version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
  }
  namespace createVKSession {
    /** vision kit 版本 */
    interface Version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
    /** 跟踪配置 */
    interface Track {
      /** 平面跟踪配置 */
      plane: Plane
    }
    /** 平面跟踪配置 */
    interface Plane {
      /** 平面跟踪配置模式 */
      mode: keyof PlaneMode
    }
    /** 平面跟踪配置模式合法值 */
    interface PlaneMode {
      /** 检测横向平面 */
      1
      /** 检测纵向平面，只有 v2 版本支持 */
      2
      /** 检测横向和纵向平面，只有 v2 版本支持 */
      3
    }
  }

  /** anchor 对象，只有 v2 版本支持
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKAnchor.html
   */
  interface VKAnchor {
    /** 唯一标识 */
    id: number
    /** 类型 */
    type: keyof VKAnchor.Type
    /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
    transform: Float32Array
    /** 尺寸，只有平面 anchor 支持 */
    size: VKAnchor.Size
    /** 方向，只有平面 anchor 支持 */
    alignment: number
  }
  namespace VKAnchor {
    /** anchor 对象类型合法值 */
    interface Type {
      /** 平面 */
      0
    }
    /** anchor 对象类型合法值 */
    interface Size {
      /** 宽度 */
      width: number
      /** 高度 */
      height: number
    }
  }

  /** 相机对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.html
   */
  interface VKCamera {
    /** 视图矩阵 */
    viewMatrix: Float32Array
    /** 相机内参，只有 v2 版本支持 */
    intrinsics: Float32Array
    /** 获取投影矩阵
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKCamera.getProjectionMatrix.html
     */
    getProjectionMatrix (
      /** 近视点 */
      near: number,
      /** 远视点 */
      far: number
    ): Float32Array
  }

  /** vision kit 会话对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.html
   */
  interface VKFrame {
    /** 生成时间 */
    timestamp: number
    /** 相机对象 */
    camera: VKCamera
    /** 获取当前帧纹理，目前只支持 YUV 纹理
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getCameraTexture.html
     */
    getCameraTexture(ctx: WebGLRenderingContext): VKFrame.getCameraTextureResult
    /** 获取纹理调整矩阵。默认获取到的纹理是未经裁剪调整的纹理，此矩阵可用于在着色器中根据帧对象尺寸对纹理进行裁剪
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKFrame.getDisplayTransform.html
     */
    getDisplayTransform(): Float32Array
  }

  namespace VKFrame {
    /** 帧纹理对象 */
    interface getCameraTextureResult {
      /** Y 分量纹理 */
      yTexture: WebGLTexture
      /** UV 分量纹理 */
      uvTexture: WebGLTexture
    }
  }

  /** vision kit 会话对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.html
   */
  interface VKSession {
    /** 会话状态 */
    state: keyof VKSession.State
    /** 会话配置 */
    config: VKSession.Config
    /** 相机尺寸 */
    cameraSize: VKSession.Size
    /** 取消由 requestAnimationFrame 添加到计划中的动画帧请求
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.cancelAnimationFrame.html
     */
    cancelAnimationFrame(requestID: number): void
    /** 销毁会话
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.destroy.html
     */
    destroy(): void
    /** 获取帧对象，每调用一次都会触发一次帧分析过程
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.getVKFrame.html
     */
    getVKFrame(
     /** 宽度 */
     width: number,
     /** 高度 */
     height: number
    ): VKFrame
    /** 触摸检测，v1 版本只支持单平面（即 hitTest 生成一次平面后，后续 hitTest 均不会再生成平面，而是以之前生成的平面为基础进行检测）。
     *
     * 如果需要重新识别其他平面，可以在调用此方法时将 reset 参数置为 true。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.hitTest.html
     */
    hitTest(
     /** 相对视窗的横坐标，取值范围为 [0, 1]，0 为左边缘，1 为右边缘 */
     x: number,
     /** 相对视窗的纵坐标，取值范围为 [0, 1]，0 为上边缘，1 为下边缘 */
     y: number,
     /** 是否需要重新识别其他平面，v2 版本不再需要此参数 */
     reset?: boolean
    ): VKSession.hitTestResult[]
    /** 取消监听会话事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.off.html
     */
    off(
     /** 事件名称 */
     eventName: string,
     /** 事件监听函数 */
     fn: Function
    ): void
    /** 监听会话事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.on.html
     */
    on(
     /** 事件名称 */
     eventName: string,
     /** 事件监听函数 */
     fn: Function
    ): void
    /** 在下次进行重绘时执行。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.requestAnimationFrame.html
     */
    requestAnimationFrame(
     /** 执行函数 */
     callback: Function
    ): number
    /** 开启会话。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.start.html
     */
    start(
     /** 开启会话回调 */
     callback: (status: keyof VKSession.StartStatus) => void
    ): void
    /** 停止会话。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.stop.html
     */
     stop(): void
  }
  namespace VKSession {
    /** state 的合法值 */
    interface State {
      /** 不可用 */
      0
      /** 运行中 */
      1
      /** 暂停中 */
      2
    }
    /** 会话配置 */
    interface Config {
      /** 不可用 */
      version: keyof version
      /** 运行中 */
      track: track
    }
    /** vision kit 版本 */
    interface version {
      /** 旧版本 */
      v1
      /** v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 */
      v2
    }
    /** 跟踪配置 */
    interface track {
      /** 平面跟踪配置 */
      plane: plane
    }
    /** 平面跟踪配置 */
    interface plane {
      /** 平面跟踪配置模式 */
      mode: keyof PlaneMode
    }
    /** 平面跟踪配置模式合法值 */
    interface PlaneMode {
      /** 检测横向平面 */
      1
      /** 检测纵向平面，只有 v2 版本支持 */
      2
      /** 检测横向和纵向平面，只有 v2 版本支持 */
      3
    }
    /** 相机尺寸 */
    interface Size {
      /** 宽度 */
      width: number
      /** 高度 */
      height: number
    }

    /** hitTest 检测结果 */
    interface hitTestResult {
      /** 包含位置、旋转、放缩信息的矩阵，以列为主序 */
      transform: Float32Array
    }

    /** start status 的合法值 */
    interface StartStatus {
      /** 成功 */
      0
      /** 系统错误 */
      2000000
      /** 参数错误 */
      2000001
      /** 设备不支持 */
      2000002
      /** 系统不支持 */
      2000003
      /** 会话不可用 */
      2003000
      /** 未开启系统相机权限 */
      2003001
      /** 未开启小程序相机权限 */
      2003002
    }
  }

  interface TaroStatic {
    /** 判断支持版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.isVKSupport.html
     */
     isVKSupport (version: keyof isVKSupport.Version): boolean /** 是否支持对应版本的 vision kit */

    /** 创建 vision kit 会话对象
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.createVKSession.html
     */
    createVKSession (version: keyof createVKSession.Version): VKSession /** vision kit 会话对象 */
  }
}
