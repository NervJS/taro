/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native'

import { PageContainerProps } from './PropsType'

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width

class _Container extends React.Component<PageContainerProps, any> {
  y = 0
  x = 0
  enterTimer: ReturnType<typeof setTimeout>
  leaveTimer: ReturnType<typeof setTimeout>
  constructor(props: PageContainerProps) {
    super(props)
    this.state = {
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }
    switch (props.position) {
      case 'top':
        this.y = -ScreenHeight
        break
      case 'bottom':
        this.y = ScreenHeight
        break
      case 'right':
        this.x = -ScreenWidth
        break
      case 'center':
        this.y = 0
        break
      default:
        break
    }
  }

  componentDidMount() {
    const { duration, position, onBeforeEnter, onAfterEnter } = this.props
    onBeforeEnter && onBeforeEnter()
    if (position === 'top' || position === 'bottom') {
      Animated.timing(this.state.translateY, {
        toValue: -this.y,
        duration: duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start()
    } else if (position === 'right') {
      Animated.timing(this.state.translateX, {
        toValue: this.x,
        duration: duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start()
    } else {
      // center
    }
    this.enterTimer = setTimeout(() => {
      onAfterEnter && onAfterEnter()
    }, duration)
  }

  componentWillUnmount() {
    const { onBeforeLeave, onLeave } = this.props
    onBeforeLeave && onBeforeLeave()
    onLeave && onLeave()
    this.enterTimer && clearTimeout(this.enterTimer)
  }

  render(): JSX.Element {
    const { children, overlay, round, position, overlayStyle, customStyle } = this.props
    const _height = position === 'top' || position === 'bottom' ? {} : { height: ScreenHeight }
    let _radiusStyle = {}
    if (round) {
      if (position === 'top') {
        _radiusStyle = {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }
      } else if (position === 'bottom') {
        _radiusStyle = {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }
      }
    }

    return (
      <View
        style={StyleSheet.flatten([
          {
            flex: 1,
            backgroundColor: overlay ? 'rgba(0,0,0,0.3)' : 'transparent',
            justifyContent: position === 'bottom' ? 'flex-end' : 'flex-start',
          },
          overlayStyle
        ])}
      >
        <Animated.View
          style={StyleSheet.flatten([
            {
              ..._height,
              ..._radiusStyle,
              width: ScreenWidth,
              backgroundColor: '#fff',
              overflow: 'hidden',
              transform: [
                {
                  translateY: this.state.translateY,
                },
                {
                  translateX: this.state.translateX,
                }
              ],
              top: this.y,
              right: this.x
            },
            customStyle,
          ])}>
          {children}
        </Animated.View>
      </View>
    )
  }
}

export default _Container
