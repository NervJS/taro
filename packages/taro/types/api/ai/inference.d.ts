import Taro from '../../index'

declare module '../../index' {
  namespace getInferenceEnvInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** AI推理引擎版本*/
      ver: string
    }
  }

  namespace createInferenceSession {
    interface Option {
      /** 模型文件路径，目前只执行后缀为.onnx格式(支持代码包路径，和本地文件系统路径） */
      model: string
      /** 推理精度，有效值为 0 - 4。
       * 一般来说，使用的precesionLevel等级越低，推理速度越快，但可能会损失精度。
       * 推荐开发者在开发时，在效果满足需求时优先使用更低精度以提高推理速度，节约能耗。
       */
      precesionLevel?: PrecesionLevel
      /** 是否生成量化模型推理 */
      allowQuantize?: boolean
      /** 是否使用NPU推理，仅对IOS有效 */
      allowNPU?: boolean
      /** 输入典型分辨率 */
      typicalShape?: boolean
    }

    interface PrecesionLevel {
      /** 使用fp16 存储浮点，fp16计算，Winograd 算法也采取fp16 计算，开启近似math计算 */
      0
      /** 使用fp16 存储浮点，fp16计算，禁用 Winograd 算法，开启近似math计算 */
      1
      /** 使用fp16 存储浮点，fp32计算，开启 Winograd，开启近似math计算 */
      2
      /** 使用fp32 存储浮点，fp32计算，开启 Winograd，开启近似math计算 */
      3
      /** 使用fp32 存储浮点，fp32计算，开启 Winograd，关闭近似math计算 */
      4
    }
  }

  interface InferenceSession {
    /** 销毁 InferenceSession 实例
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.destroy.html
     */
    destroy(): void
    /** 取消监听模型加载失败事件. 传入指定回调函数则只取消指定回调，不传则取消所有回调
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.offError.html
     */
    offError(callback?: InferenceSession.OnErrorCallback): void
    /** 取消监听模型加载完成事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.offLoad.html
     */
    offLoad(callback?: InferenceSession.OnLoadCallback): void
    /** 监听模型加载失败事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.onError.html
     */
    onError(callback: InferenceSession.OnErrorCallback): void
    /** 监听模型加载完成事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.onLoad.html
     */
    onLoad(callback: InferenceSession.OnLoadCallback): void
    /** 运行推断
     * 需要在 session.onLoad 回调后使用。接口参数为 Tensors 对象，返回 Promise。
     * 一个 InferenceSession 被创建完成后可以重复多次调用 InferenceSession.run(), 直到调用 session.destroy() 进行销毁。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/InferenceSession.destroy.html
     */
    run(option: InferenceSession.Tensors): Promise<InferenceSession.Tensors>
  }

  namespace InferenceSession {
    interface Type {
      'uint8'
      'int8'
      'uint32'
      'int32'
      'float32'
    }
    interface Tensor {
      /** Tensor shape （Tensor 形状，例如 [1, 3, 224, 224] 即表示一个4唯Tensor，每个维度的长度分别为1, 3, 224, 224） */
      shape: number[]
      /** Tensor 值，一段 ArrayBuffer */
      data: ArrayBuffer
      /** ArrayBuffer 值的类型，合法值有 uint8, int8, uint32, int32, float32 */
      type: keyof Type
    }

    interface Tensors  {
      [key: string]: Tensor
    }

    /** 模型加载失败回调函数 */
    type OnErrorCallback = (res: TaroGeneral.CallbackResult) => void
    /** 模型加载完成回调函数 */
    type OnLoadCallback = (res: TaroGeneral.CallbackResult) => void
  }

  interface TaroStatic {
    /** 获取通用AI推理引擎版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/wx.getInferenceEnvInfo.html
     */
    getInferenceEnvInfo(
      option: getInferenceEnvInfo.Option
    ): void

    /** 创建 AI 推理 Session
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ai/inference/wx.createInferenceSession.html
     */
    createInferenceSession(
      option: createInferenceSession.Option
    ): InferenceSession
  }
}
