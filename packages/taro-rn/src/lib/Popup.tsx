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
