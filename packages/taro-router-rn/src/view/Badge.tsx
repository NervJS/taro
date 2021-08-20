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

// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { Animated, StyleSheet, StyleProp, TextStyle } from 'react-native'

export interface BadgeProps {
  visible: boolean,
  children?: string | number,
  size?: number,
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
}

export interface BadgeState {
  opacity: Animated.Value,
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render () {
    const { opacity } = this.state
    const { style, size = 18, children, visible } = this.props
    const { ...restStyle } = StyleSheet.flatten(style) || {}
    const textColor = 'white'

    const borderRadius = size / 2
    const fontSize = Math.floor((size * 3) / 4)

    // eslint-disable-next-line multiline-ternary
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
