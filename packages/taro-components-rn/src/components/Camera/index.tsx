/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import React, { Component } from 'react'
import View from '../View'
import Text from '../Text'
import { BarCodeScanningResult, Camera, CameraMountError, PermissionStatus } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { CameraProps, CameraState } from './PropsType'
import styles from './styles'

export class _Camera extends Component<CameraProps, CameraState> {
  constructor(props: CameraProps) {
    super(props)
    this.state = {
      hasPermission: null,
    }
  }

  expoCameraRef = React.createRef<Camera>()

  async componentDidMount(): Promise<void> {
    const { status } = await Camera.requestCameraPermissionsAsync()
    this.setState({
      hasPermission: status === PermissionStatus.GRANTED
    })
  }

  onError = (event: CameraMountError): void => {
    this.props.onError && this.props.onError(event as any)
  }

  onInitDone = (): void => {
    global._taroCamera = this.expoCameraRef && this.expoCameraRef.current
    const event: any = {}
    this.props.onInitDone && this.props.onInitDone(event)
  }

  onScanCode = (event: BarCodeScanningResult): void => {
    const { data } = event
    this.props.onScanCode && this.props.onScanCode({
      detail: {
        result: data
      },
      ...event
    } as any)
  }

  render(): JSX.Element {
    const { hasPermission } = this.state
    const { devicePosition, style, mode, flash } = this.props
    const type = !devicePosition ? null : Camera.Constants.Type[devicePosition]
    if (hasPermission === null) {
      return <View />
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>
    }
    const barCodeScannerSettings =
      mode === 'scanCode'
        ? {
          barCodeScannerSettings: {
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
          },
          onBarCodeScanned: this.onScanCode
        }
        : {}
    return (
      <Camera
        ref={this.expoCameraRef}
        // @ts-ignore
        type={type}
        flashMode={flash}
        onMountError={this.onError}
        onCameraReady={this.onInitDone}
        ratio={this.props.ratio}
        {...barCodeScannerSettings}
        style={[styles.camera, style]}
      />
    )
  }
}

export default _Camera
