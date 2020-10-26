import React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, View, StyleSheet, Dimensions, Animated, Easing, ViewPropTypes } from 'react-native'
import { Mask } from '../Mask'

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

class Popup extends Component<any, any>  {
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

  constructor (props) {
    super(props)
    this.state = { visible: false, translateY: new Animated.Value(height) }
    this.handleLayout = this.handleLayout.bind(this)
  }

  componentWillReceiveProps (nextProp) {
    if (this.props.visible !== nextProp.visible) {
      if (nextProp.visible) {
        this.setState({ visible: true })
        return
      }
      Animated.timing(this.state.translateY, {
        toValue: this.height,
        duration: 300,
        easing: (Easing as any).easeInOut
      }).start(() => this.setState({ visible: false }))
    }
  }

  handleLayout () {
    this.popup.measure((x, y, w, h) => {
      this.height = h
      this.setState({ translateY: new Animated.Value(h) })
      Animated.timing(this.state.translateY, {
        toValue: 0,
        duration: 300,
        easing: (Easing as any).easeInOut
      }).start()
    })
  }

  render () {
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

export default Popup
