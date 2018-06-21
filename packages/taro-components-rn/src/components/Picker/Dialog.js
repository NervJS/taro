/**
 * @flow
 */

import * as React from 'react'
import {
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native'
import styles from './styles'

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
  language: string
}

class _PickerDialog extends React.Component<Props, State> {
  props: Props
  state: State = {
    language: ''
  }

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

  render () {
    const {
      children,
      show,
    } = this.props

    const DialogWrapper = Platform.select({
      ios: KeyboardAvoidingView,
      android: View
    })

    return (
      <View>
        <Modal
          visible={show}
          animationType="fade"
          transparent={true}
          onRequestClose={this.onRequestClose}
        >
          <TouchableWithoutFeedback
            onPress={this.onCancel}
            underlayColor="rgba(0, 0, 0, 0.5)"
          >
            <View style={styles.dialogOverlay} />
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={show}
          animationType="slide"
          transparent={true}
          onRequestClose={this.onRequestClose}
        >
          <DialogWrapper style={styles.dialogWrapper} behavior="padding">
            <View style={styles.dialogContainer}>
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
            </View>
          </DialogWrapper>
        </Modal>
      </View>
    )
  }
}

export default _PickerDialog
