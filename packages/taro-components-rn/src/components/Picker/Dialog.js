/**
 * This is a controlled component.
 *
 * reference(2018/07/04): react-native-modal
 *
 * @flow
 */

import * as React from 'react'
import {
  Modal,
  TouchableWithoutFeedback,
  // Platform,
  // KeyboardAvoidingView,
  View,
  Text,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import * as ANIMATION_DEFINITIONS from './animations'
import styles from './styles'

// Override default animations
Animatable.initializeRegistryWithDefinitions(ANIMATION_DEFINITIONS)
// Utility for creating custom animations
// const makeAnimation = (name, obj) => {
//   Animatable.registerAnimation(name, Animatable.createAnimation(obj))
// }

// const isIOS = Platform.OS === 'ios'

type Props = {
  children?: React.Node,
  /**
   * Control visible of Dialog
   */
  show?: boolean,
  /**
   * Function for setting SHOW false.
   */
  onCancel?: Function,
  /**
   * Confirm.
   */
  onConfirm?: Function,
}
type State = {
  isVisible: boolean,
  deviceWidth: number,
  deviceHeight: number
}

class _PickerDialog extends React.Component<Props, State> {
  props: Props
  state: State = {
    isVisible: !!this.props.show,
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height
  }
  transitionLock: boolean = false
  backdropRef: React.ElementRef<Animatable.View>
  contentRef: React.ElementRef<Animatable.View>

  // onOverlayClick = () => {
  //   const { onCancel } = this.props
  //   onCancel && onCancel()
  // }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  onConfirm = () => {
    const { onConfirm } = this.props
    onConfirm && onConfirm()
  }

  // Android or AppleTV
  onRequestClose = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  handleDimensionsUpdate = () => {
    const deviceWidth = Dimensions.get('window').width
    const deviceHeight = Dimensions.get('window').height
    if (
      deviceWidth !== this.state.deviceWidth ||
      deviceHeight !== this.state.deviceHeight
    ) {
      this.setState({ deviceWidth, deviceHeight })
    }
  }

  open = () => {
    if (this.transitionLock) return
    this.transitionLock = true
    if (this.backdropRef) {
      this.backdropRef.transitionTo({ opacity: 0.7 }, 300)
    }
    if (this.contentRef) {
      this.contentRef['slideInUp'](300).then(() => {
        this.transitionLock = false
        if (!this.props.show) {
          this._close()
        }
      })
    }
  }

  _close = () => {
    if (this.transitionLock) return
    this.transitionLock = true
    if (this.backdropRef) {
      this.backdropRef.transitionTo({ opacity: 0 }, 300)
    }
    if (this.contentRef) {
      this.contentRef['slideOutDown'](300).then(() => {
        this.transitionLock = false
        if (this.props.show) {
          this.open()
        } else {
          this.setState({ isVisible: false })
        }
      })
    }
  }

  componentDidMount () {
    if (this.props.show) {
      this.open()
    }
    DeviceEventEmitter.addListener(
      'didUpdateDimensions',
      this.handleDimensionsUpdate
    )
  }

  componentWillUnmount () {
    DeviceEventEmitter.removeListener(
      'didUpdateDimensions',
      this.handleDimensionsUpdate
    )
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.show && !prevProps.show) {
      this.open()
    } else if (!this.props.show && prevProps.show) {
      this._close()
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (!this.state.isVisible && nextProps.show) {
      this.setState({ isVisible: true })
    }
  }

  render () {
    const {
      children,
      // show,
    } = this.props
    const { isVisible, deviceWidth, deviceHeight } = this.state

    const computedStyle = [
      { margin: 0, transform: [{ translateY: 0 }] },
      styles.content,
      // style
    ]

    // const DialogWrapper = Platform.select({
    //   ios: KeyboardAvoidingView,
    //   android: View
    // })

    return (
      <Modal
        visible={isVisible}
        animationType="none"
        transparent={true}
        onRequestClose={this.onRequestClose}
      >
        <TouchableWithoutFeedback onPress={this.onCancel}>
          <Animatable.View
            ref={(ref) => { this.backdropRef = ref }}
            style={[
              styles.backdrop,
              {
                width: deviceWidth,
                height: deviceHeight
              }
            ]}
          />
        </TouchableWithoutFeedback>
        <Animatable.View
          ref={(ref) => { this.contentRef = ref }}
          style={computedStyle}
        >
          <View style={styles.dialogHead}>
            <TouchableWithoutFeedback onPress={this.onCancel}>
              <View><Text style={styles.dialogCancelText}>取消</Text></View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.onConfirm}>
              <View><Text style={styles.dialogConfirmText}>确定</Text></View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.dialogSlot}>
            {children}
          </View>
        </Animatable.View>
      </Modal>
    )
  }
}

export default _PickerDialog
