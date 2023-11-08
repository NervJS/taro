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
