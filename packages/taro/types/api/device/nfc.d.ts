import Taro from '../../index'

declare module '../../index' {
  namespace stopHCE {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.NFCError) => void
    }
  }

  namespace startHCE {
    interface Option {
      /** 需要注册到系统的 AID 列表 */
      aid_list: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.NFCError) => void
    }
  }

  namespace sendHCEMessage {
    interface Option {
      /** 二进制数据 */
      data: ArrayBuffer
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.NFCError) => void
    }
  }

  namespace onHCEMessage {
    /** 接收 NFC 设备消息事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** `messageType=1` 时 ,客户端接收到 NFC 设备的指令 */
      data: ArrayBuffer
      /** 消息类型 */
      messageType: keyof MessageType
      /** `messageType=2` 时，原因 */
      reason: number
    }

    /** 消息类型 */
    interface MessageType {
      /** HCE APDU Command类型，小程序需对此指令进行处理，并调用 sendHCEMessage 接口返回处理指令 */
      1
      /** 设备离场事件类型 */
      2
    }
  }

  namespace getHCEState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.NFCError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.NFCError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.NFCError) => void
    }
  }

  /** IsoDep 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.html
   */
  interface IsoDep {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.close.html
     */
    close(option?: IsoDep.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.connect.html
     */
    connect(option?: IsoDep.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取复位信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.getHistoricalBytes.html
     */
    getHistoricalBytes(option?: IsoDep.getHistoricalBytes.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: IsoDep.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.isConnected.html
     */
    isConnected(option?: IsoDep.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.setTimeout.html
     */
    setTimeout(option?: IsoDep.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/IsoDep.transceive.html
     */
    transceive(option?: IsoDep.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace IsoDep {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getHistoricalBytes {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 返回历史二进制数据 */
        histBytes: ArrayBuffer
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** MifareClassic 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.html
   */
  interface MifareClassic {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.close.html
     */
    close(option?: MifareClassic.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.connect.html
     */
    connect(option?: MifareClassic.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: MifareClassic.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.isConnected.html
     */
    isConnected(option?: MifareClassic.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.setTimeout.html
     */
    setTimeout(option?: MifareClassic.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareClassic.transceive.html
     */
    transceive(option?: MifareClassic.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace MifareClassic {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** MifareUltralight 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.html
   */
  interface MifareUltralight {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.close.html
     */
    close(option?: MifareUltralight.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.connect.html
     */
    connect(option?: MifareUltralight.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: MifareUltralight.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.isConnected.html
     */
    isConnected(option?: MifareUltralight.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.setTimeout.html
     */
    setTimeout(option?: MifareUltralight.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/MifareUltralight.transceive.html
     */
    transceive(option?: MifareUltralight.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace MifareUltralight {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** Ndef 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.html
   */
  interface Ndef {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.close.html
     */
    close(option?: Ndef.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.connect.html
     */
    connect(option?: Ndef.connect.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.isConnected.html
     */
    isConnected(option?: Ndef.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 取消监听 Ndef 消息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.offNdefMessage.html
     */
    offNdefMessage(
      /** 监听 Ndef 消息回调函数 */
      callback: Ndef.onNdefMessage.Callback,
    ): void
    /** 监听 Ndef 消息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.onNdefMessage.html
     */
    onNdefMessage(
      /** 监听 Ndef 消息回调函数 */
      callback: Ndef.onNdefMessage.Callback,
    ): void
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.setTimeout.html
     */
    setTimeout(option?: Ndef.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 重写 Ndef 标签内容
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.writeNdefMessage.html
     */
    writeNdefMessage(option?: Ndef.writeNdefMessage.Option): Promise<TaroGeneral.NFCError>
  }

  namespace Ndef {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace onNdefMessage {
      /** 监听 Ndef 消息回调函数 */
      type Callback = (...args: unknown[]) => void
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace writeNdefMessage {
      interface Option {
        /** uri 数组 */
        uris?: string[]
        /** text 数组 */
        texts?: string[]
        /** 二进制对象数组, 需要指明 id, type 以及 payload (均为 ArrayBuffer 类型) */
        records?: record[]
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
      interface record {
        id: ArrayBuffer
        type: ArrayBuffer
        payload: ArrayBuffer
      }
    }
  }

  /** NfcA 标签
   * @supported weapp, tt
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.html
   */
  interface NfcA {
    /** 断开连接
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.close.html
     */
    close(option?: NfcA.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.connect.html
     */
    connect(option?: NfcA.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取 ATQA 信息
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.getAtqa.html
     */
    getAtqa(option?: NfcA.getAtqa.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: NfcA.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 获取 SAK 信息
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.getSak.html
     */
    getSak(option?: NfcA.getSak.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.isConnected.html
     */
    isConnected(option?: NfcA.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.setTimeout.html
     */
    setTimeout(option?: NfcA.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcA.transceive.html
     */
    transceive(option?: NfcA.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace NfcA {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getAtqa {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 返回 ATQA/SENS_RES 数据 */
        atqa: ArrayBuffer
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace getSak {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 返回 SAK/SEL_RES 数据 */
        sak: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** NFC 实例
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.html
   */
  interface NFCAdapter {
    /** 获取IsoDep实例，实例支持ISO-DEP (ISO 14443-4)标准的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getIsoDep.html
     */
    getIsoDep(): IsoDep
    /** 获取MifareClassic实例，实例支持MIFARE Classic标签的读写
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getMifareClassic.html
     */
    getMifareClassic(): MifareClassic
    /** 获取MifareUltralight实例，实例支持MIFARE Ultralight标签的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getMifareUltralight.html
     */
    getMifareUltralight(): MifareUltralight
    /** 获取Ndef实例，实例支持对NDEF格式的NFC标签上的NDEF数据的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNdef.html
     */
    getNdef(): Ndef
    /** 获取NfcA实例，实例支持NFC-A (ISO 14443-3A)标准的读写
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcA.html
     */
    getNfcA(): NfcA
    /** 获取NfcB实例，实例支持NFC-B (ISO 14443-3B)标准的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcB.html
     */
    getNfcB(): NfcB
    /** 获取NfcF实例，实例支持NFC-F (JIS 6319-4)标准的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcF.html
     */
    getNfcF(): NfcB
    /** 获取NfcV实例，实例支持NFC-V (ISO 15693)标准的读写
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcV.html
     */
    getNfcV(): NfcV
    /** 取消监听 NFC Tag
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.offDiscovered.html
     */
    offDiscovered(
      /** 监听 NFC Tag的回调函数 */
      callback?: NFCAdapter.onDiscovered.Callback,
    ): void
    /** 监听 NFC Tag
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.onDiscovered.html
     */
    onDiscovered(
      /** 监听 NFC Tag的回调函数 */
      callback: NFCAdapter.onDiscovered.Callback,
    ): void
    /** 开始扫描NFC标签
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.startDiscovery.html
     */
    startDiscovery(option?: NFCAdapter.startDiscovery.Option): Promise<TaroGeneral.NFCError>
    /** 关闭NFC标签扫描
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.stopDiscovery.html
     */
    stopDiscovery(option?: NFCAdapter.stopDiscovery.Option): Promise<TaroGeneral.NFCError>
  }

  namespace NFCAdapter {
    namespace onDiscovered {
      /** 监听 NFC Tag的回调函数 */
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        /** tech 数组，用于匹配NFC卡片具体可以使用什么标准（NfcA等实例）处理 */
        techs: string[]
        /** NdefMessage 数组，消息格式为 {id: ArrayBuffer, type: ArrayBuffer, payload: ArrayBuffer} */
        messages: NdefMessage[]
        /** NFC标签的UID
         * @supported tt
         */
        id?: ArrayBuffer
      }

      interface NdefMessage {
        id: ArrayBuffer
        type: ArrayBuffer
        payload: ArrayBuffer
      }
    }
    namespace startDiscovery {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace stopDiscovery {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
  }

  /** NfcB 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.html
   */
  interface NfcB {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.close.html
     */
    close(option?: NfcB.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.connect.html
     */
    connect(option?: NfcB.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: NfcB.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.isConnected.html
     */
    isConnected(option?: NfcB.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.setTimeout.html
     */
    setTimeout(option?: NfcB.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcB.transceive.html
     */
    transceive(option?: NfcB.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace NfcB {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** NfcF 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.html
   */
  interface NfcF {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.close.html
     */
    close(option?: NfcF.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.connect.html
     */
    connect(option?: NfcF.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: NfcF.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.isConnected.html
     */
    isConnected(option?: NfcF.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.setTimeout.html
     */
    setTimeout(option?: NfcF.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcF.transceive.html
     */
    transceive(option?: NfcF.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace NfcF {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  /** NfcV 标签
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.html
   */
  interface NfcV {
    /** 断开连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.close.html
     */
    close(option?: NfcV.close.Option): Promise<TaroGeneral.NFCError>
    /** 连接 NFC 标签
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.connect.html
     */
    connect(option?: NfcV.connect.Option): Promise<TaroGeneral.NFCError>
    /** 获取最大传输长度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.getMaxTransceiveLength.html
     */
    getMaxTransceiveLength(option?: NfcV.getMaxTransceiveLength.Option): Promise<TaroGeneral.NFCError>
    /** 检查是否已连接
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.isConnected.html
     */
    isConnected(option?: NfcV.isConnected.Option): Promise<TaroGeneral.NFCError>
    /** 设置超时时间
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.setTimeout.html
     */
    setTimeout(option?: NfcV.setTimeout.Option): Promise<TaroGeneral.NFCError>
    /** 发送数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NfcV.transceive.html
     */
    transceive(option?: NfcV.transceive.Option): Promise<TaroGeneral.NFCError>
  }

  namespace NfcV {
    namespace close {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace connect {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        /** 最大传输长度 */
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace setTimeout {
      interface Option {
        /** 设置超时时间 (ms) */
        timeout: number
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (res: TaroGeneral.NFCError) => void
      }
    }
    namespace transceive {
      interface Option {
        /** 需要传递的二进制数据 */
        data: ArrayBuffer
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: TaroGeneral.NFCError) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.NFCError) => void
        /** 接口调用成功的回调函数 */
        success?: (result: SuccessCallbackResult) => void
      }
      interface SuccessCallbackResult extends TaroGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  interface TaroStatic {
    /**
     * 关闭 NFC 模块。仅在安卓系统下有效。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.stopHCE({
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.stopHCE.html
     */
    stopHCE(option?: stopHCE.Option): Promise<TaroGeneral.NFCError>

    /**
     * 初始化 NFC 模块。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.startHCE({
     *   aid_list: ['F222222222']
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html
     */
    startHCE(option: startHCE.Option): Promise<TaroGeneral.NFCError>

    /**
     * 发送 NFC 消息。仅在安卓系统下有效。
     * @supported weapp
     * @example
     * ```tsx
     * const buffer = new ArrayBuffer(1)
     * const dataView = new DataView(buffer)
     * dataView.setUint8(0, 0)
     *       Taro.startHCE({
     *   success: function (res) {
     *     Taro.onHCEMessage(function (res) {
     *       if (res.messageType === 1) {
     *         Taro.sendHCEMessage({data: buffer})
     *       }
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html
     */
    sendHCEMessage(option: sendHCEMessage.Option): Promise<TaroGeneral.NFCError>

    /**
     * 监听接收 NFC 设备消息事件，仅能注册一个监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html
     */
    onHCEMessage(
      /** 接收 NFC 设备消息事件的回调函数 */
      callback: onHCEMessage.Callback,
    ): void

    /** 接收 NFC 设备消息事件，取消事件监听。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.offHCEMessage.html
     */
    offHCEMessage(
      /** 接收 NFC 设备消息事件的回调函数 */
      callback: onHCEMessage.Callback,
    ): void

    /** 获取 NFC 实例
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getNFCAdapter.html
     */
    getNFCAdapter(): NFCAdapter

    /** 判断当前设备是否支持 HCE 能力。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getHCEState({
     *   success: function (res) {
     *     console.log(res.errCode)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getHCEState.html
     */
    getHCEState(option?: getHCEState.Option): Promise<TaroGeneral.NFCError>
  }
}
