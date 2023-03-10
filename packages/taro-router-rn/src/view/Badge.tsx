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

import * as React from 'react'
import { Animated, StyleProp, StyleSheet, TextStyle } from 'react-native'

export interface BadgeProps {
  visible: boolean
  children?: string | number
  size?: number
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
}

export interface BadgeState {
  opacity: Animated.Value
  visible: boolean
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden'
  }
})

export default class Badge extends React.PureComponent<BadgeProps, BadgeState> {
  constructor (props: BadgeProps) {
    super(props)
    const { visible } = this.props
    this.state = {
      opacity: new Animated.Value(visible ? 1 : 0),
      visible: visible
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps: BadgeProps): void {
    const { visible, opacity } = this.state
    const curVisible = nextProps.visible
    if (curVisible !== visible) {
      if (curVisible) {
        Animated.spring(opacity, {
          toValue: 1,
          // duration: 250,
          useNativeDriver: true
        }).start(({ finished }) => {
          if (finished) {
            this.setState({
              visible: true
            })
          }
        })
      } else {
        this.setState({
          visible: false
        })
        Animated.spring(opacity, {
          toValue: 0,
          // duration: 200,
          useNativeDriver: true
        }).start()
      }
    }
  }

  render () {
    const { opacity } = this.state
    const { style, size = 18, children, visible } = this.props
    const { ...restStyle } = StyleSheet.flatten(style) || {}
    const textColor = 'white'

    const borderRadius = size / 2
    const fontSize = Math.floor((size * 3) / 4)

    return (!visible ? null
      : (
        <Animated.Text
          numberOfLines={1}
          style={[
            {
              opacity,
              transform: [
                {
                  scale: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }
              ],
              backgroundColor: '#FA5151',
              color: textColor,
              fontSize,
              lineHeight: size - 1,
              height: size,
              minWidth: size,
              borderRadius
            },
            styles.container,
            restStyle
          ]}
        >
          {children}
        </Animated.Text>)
    )
  }
}
