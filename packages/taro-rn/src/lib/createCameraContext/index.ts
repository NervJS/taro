import * as Permissions from 'expo-permissions'
const globalAny:any = global

class CameraContext {
  private cameraRef: any
  private recordCallback: Taro.CameraContext.StopRecordOption

  constructor (cameraRef) {
    this.cameraRef = cameraRef
  }

  /**
   * 开始录像
   */
  startRecord = (option: Taro.CameraContext.StartRecordOption) => {
    Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING).then(() => {
      this.cameraRef?.recordAsync().then((res) => {
        const { uri } = res
        const result = {
          tempVideoPath: uri,
          tempThumbPath: '',
          errMsg: 'stopRecord: ok'
        }
        this.recordCallback?.success?.(result)
      }).catch((e) => {
        const res = {
          errMsg: e.message
        }
        option?.fail?.(res)
        option?.complete?.(res)
        this.recordCallback?.fail?.({ errMsg: e })
      }).finally(() => {
        this.recordCallback?.complete?.({ errMsg: '' })
      })
      const res = {
        errMsg: 'startRecord: ok'
      }
      option?.success?.(res)
      option?.complete?.(res)
    })
  }

  /**
   * 结束录像
   */
  stopRecord = (option: Taro.CameraContext.StopRecordOption) => {
    this.recordCallback = option
    this.cameraRef?.stopRecording()
  }

  /**
   * 拍摄照片
   */
  takePhoto = (option: Taro.CameraContext.TakePhotoOption) => {
    let quality = 0
    switch (option.quality) {
      case 'high':
        quality = 1
        break
      case 'normal':
        quality = 0.6
        break
      case 'low':
        quality = 0.3
        break
    }
    Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING).then(() =>
      this.cameraRef?.takePictureAsync({ quality: quality }).then(res => {
        const { uri } = res
        option?.success?.({
          tempImagePath: uri ?? '',
          errMsg: 'takePhoto: ok'
        })
      }).catch(e => {
        option?.fail?.({ errMsg: e })
      }).finally(() =>
        option?.complete?.({ errMsg: '' })
      )).catch((e) =>
      console.log(e)
    )
  }

  /**
   * 获取 Camera 实时帧数据
   * not support
   */
  onCameraFrame = () => {
    return {
      start(): void {
        console.log('not support')
      },
      stop(): void {
        console.log('not support')
      }
    }
  }
}
/**
 * 创建 video 上下文 VideoContext 对象。
 * {string} @param - id video 组件的 id
 * {object} @param t - 在自定义组件下，当前组件实例的this，以操作组件内 video 组件
 */

export function createCameraContext(): Taro.CameraContext | undefined {
  const ref = globalAny._taroCamera
  if (ref) {
    return new CameraContext(ref)
  } else {
    return undefined
  }
}
