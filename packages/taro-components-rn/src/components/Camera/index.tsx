import { BarcodeScanningResult, BarcodeType, Camera, CameraMountError, CameraView, PermissionStatus } from 'expo-camera'
import { CameraType } from 'expo-camera/build/legacy/Camera.types'
import React, { Component } from 'react'

import Text from '../Text'
import View from '../View'
import { CameraProps, CameraState } from './PropsType'
import styles from './styles'

export class _Camera extends Component<CameraProps, CameraState> {
  constructor(props: CameraProps) {
    super(props)
    this.state = {
      hasPermission: null,
    }
  }

  expoCameraRef = React.createRef<CameraView>()

  async componentDidMount(): Promise<void> {
    const permission = await Camera.requestCameraPermissionsAsync()
    this.setState({
      hasPermission: permission?.status === PermissionStatus.GRANTED
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

  onScanCode = (event: BarcodeScanningResult): void => {
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
    const type = !devicePosition ? CameraType.front : CameraType[devicePosition]

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
            barCodeTypes: ['qr'] as BarcodeType[]
          },
          onBarCodeScanned: this.onScanCode
        }
        : {}
    return (
      <CameraView
        ref={this.expoCameraRef}
        facing={type}
        flash={flash}
        onMountError={this.onError}
        onCameraReady={this.onInitDone}
        {...barCodeScannerSettings}
        style={[styles.camera, style]}
      />
    )
  }
}

export default _Camera
