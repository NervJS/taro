import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Modal, View, StyleSheet, Dimensions, Animated, Easing } from 'react-native'
import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import { Mask } from './Mask'

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    backgroundColor: '#EFEFF4'
  }
})

interface Props {
  visible?: boolean;
}

class Popup extends Component<any, any> {
  static propTypes = {
    visible: PropTypes.bool,
    onShow: PropTypes.func,
    onClose: PropTypes.func,
    style: ViewPropTypes.style,
    maskStyle: ViewPropTypes.style,
    children: PropTypes.node
  }

  height
  popup

  constructor (props:Props) {
    super(props)
    this.state = { visible: props.visible ?? false, translateY: new Animated.Value(height) }
    this.handleLayout = this.handleLayout.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProp:Props):void {
    if (this.props.visible !== nextProp.visible) {
      if (nextProp.visible) {
        this.setState({ visible: true })
        return
      }
      Animated.timing(this.state.translateY, {
        toValue: this.height,
        duration: 300,
        easing: (Easing as any).easeInOut,
        useNativeDriver: true
      }).start(() => this.setState({ visible: false }))
    }
  }

  handleLayout ():void {
    this.popup.measure((_x, _y, _w, h) => {
      this.height = h
      this.setState({ translateY: new Animated.Value(h) })
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 300,
        easing: (Easing as any).easeInOut,
        useNativeDriver: true
      }).start()
    })
  }

  render ():JSX.Element {
    const {
      style,
      maskStyle,
      onShow,
      onClose,
      children
    } = this.props

    return (
      <Modal
        visible={this.state.visible}
        transparent
        onShow={onShow}
        onRequestClose={onClose}
      >
        <Mask style={maskStyle} onPress={onClose}>
          <Animated.View
            style={[styles.popup, style, {
              transform: [{ translateY: this.state.translateY }]
            }]}
          >
            <View
              ref={(ref) => { this.popup = ref }}
              onLayout={this.handleLayout}
            >{children}</View>
          </Animated.View>
        </Mask>
      </Modal>
    )
  }
}

export { Popup }
