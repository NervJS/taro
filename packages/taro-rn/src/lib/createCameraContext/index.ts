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

import { errorHandler, successHandler } from '../../utils'
import { requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from 'expo-camera'
const globalAny: any = global

class CameraContext {
  private cameraRef: any
  private recordCallback: Taro.CameraContext.StopRecordOption

  constructor(cameraRef) {
    this.cameraRef = cameraRef
  }

  /**
   * 开始录像
   */
  startRecord = (option: Taro.CameraContext.StartRecordOption) => {
    Promise.all([requestCameraPermissionsAsync(), requestMicrophonePermissionsAsync()]).then(([cameraPermission, microphonePermission]) => {
      if(cameraPermission.granted && microphonePermission.granted) {
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
      } else {
        const res = {
          errMsg: 'startRecord: fail',
          err: Error('You have not enabled camera or microphone permissions')
        }
        option?.fail?.(res)
        option?.complete?.(res)
      }
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
  takePhoto = async (option: Taro.CameraContext.TakePhotoOption) => {
    const { quality = 'normal', success, fail, complete } = option
    let _quality = 0
    switch (quality) {
      case 'high':
        _quality = 1
        break
      case 'normal':
        _quality = 0.6
        break
      case 'low':
        _quality = 0.3
        break
    }
    try {
      const { granted } = await requestCameraPermissionsAsync()
      if (granted) {
        if (this.cameraRef?.takePictureAsync) {
          const { uri } = await this.cameraRef.takePictureAsync({ quality: _quality })
          const res = {
            tempImagePath: uri,
            errMsg: 'takePhoto: ok'
          }
          return successHandler(success, complete)(res)
        } else {
          const err = {
            errMsg: 'takePhoto: fail',
            err: Error('unknown')
          }
          return errorHandler(fail, complete)(err)
        }
      } else {
        const err = {
          errMsg: 'takePhoto: fail',
          err: Error('You have not enabled camera permissions')
        }
        return errorHandler(fail, complete)(err)
      }
    } catch (error) {
      const err = {
        errMsg: 'takePhoto: fail',
        err: error
      }
      return errorHandler(fail, complete)(err)
    }
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

  setZoom = () => {
    console.log('not support')
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
