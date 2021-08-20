/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { Component } from 'react'
import View from '../View'
import Text from '../Text'
import { BarCodeScanningResult, Camera, CameraMountError } from 'expo-camera'
import { CameraProps } from '@tarojs/components/types/Camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

// @ts-ignore
global._taroCamera = undefined

interface State {
  hasPermission: boolean | null;
}

interface Props extends CameraProps {
  ratio: string;
}

export class _Camera extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasPermission: null,
    }
  }

  ref: string | ((instance: Camera | null) => void) | React.RefObject<Camera> | null | undefined = React.createRef()

  async componentDidMount (): Promise<void> {
    const { status } = await Camera.requestPermissionsAsync()
    this.setState({
      hasPermission: status === 'granted'
    })
  }

  onError = (event: CameraMountError): void => {
    // @ts-ignore
    this.props.onError && this.props.onError(event)
  }

  onInitDone = (): void => {
    // @ts-ignore
    global._taroCamera = this.ref && this.ref.current
    // @ts-ignore
    this.props.onInitDone && this.props.onInitDone()
  }

  onScanCode = (event: BarCodeScanningResult): void => {
    const { data } = event
    // @ts-ignore
    this.props.onScanCode && this.props.onScanCode({
      detail: {
        result: data
      },
      ...event
    })
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
        ref={this.ref}
        type={type}
        flashMode={flash}
        onMountError={this.onError}
        onCameraReady={this.onInitDone}
        ratio={this.props.ratio}
        {...barCodeScannerSettings}
        style={[{ width: 300, height: 300 }, style as Record<string, unknown>]}
      />
    )
  }
}

export default _Camera
