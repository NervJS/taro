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

import * as React from 'react'
import {
  TouchableWithoutFeedback,
  Text,
  View,
  Image,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  GestureResponderEvent
} from 'react-native'
import styles from './styles'
import { extracteTextStyle, noop } from '../../utils'
import { ButtonProps, ButtonState } from './PropsType'
import loadingWarnPng from '../../assets/loading-warn.png'
import ladingPng from '../../assets/loading.png'

const Loading = (props: { type: ButtonProps['type'], hasSibling: boolean }) => {
  const { type = 'primary', hasSibling } = props
  const rotate = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      })
    )
    animation.start()

    return () => {
      animation.stop()
    }
  }, [])

  const rotateDeg: Animated.AnimatedInterpolation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  const loadingStyle = {
    ...styles.loading,
    transform: [{ rotate: rotateDeg }]
  }
  if (!hasSibling) {
    loadingStyle.marginRight = 0
  }

  return (
    <Animated.View testID='loading' style={loadingStyle}>
      <Image
        accessibilityLabel='loading image'
        source={
          type === 'warn' ? loadingWarnPng : ladingPng
        }
        style={styles.loadingImg}
      />
    </Animated.View>
  )
}

class _Button extends React.Component<ButtonProps, ButtonState> {
  static displayName = '_Button'
  static defaultProps = {
    size: 'default',
    type: 'default',
    hoverStyle: { opacity: 0.8 },
    hoverStartTime: 20,
    hoverStayTime: 70,
    disabled: false,
  }

  $touchable = React.createRef<TouchableWithoutFeedback>()

  isTouchEnd = false
  pressInTimer: number
  pressOutTimer: number

  state: ButtonState = {
    isHover: false
  }

  componentWillUnmount():void {
    clearTimeout(this.pressOutTimer)
    clearTimeout(this.pressInTimer)
  }

  onPress = (): void => {
    const { disabled, onClick = noop } = this.props
    !disabled && onClick()
  }

  onPressIn = (): void => {
    const { hoverStartTime, hoverStyle } = this.props
    this.isTouchEnd = false
    if (hoverStyle) {
      this.pressInTimer = setTimeout(() => {
        this.setState({ isHover: true }, () => {
          if (this.isTouchEnd) {
            // short press
            this.stopHover()
          }
        })
        clearTimeout(this.pressInTimer)
      }, hoverStartTime)
    }
  }

  stopHover = (): void => {
    const { hoverStayTime } = this.props
    this.pressOutTimer = setTimeout(() => {
      this.setState({ isHover: false })
      clearTimeout(this.pressOutTimer)
    }, hoverStayTime)
  }

  onPressOut = (): void => {
    const { hoverStyle } = this.props
    const { isHover } = this.state
    this.isTouchEnd = true
    if (hoverStyle && isHover) {
      // long press or error boundary
      this.stopHover()
    }
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const node = this.$touchable.current
    node && node.props.onPress && node.props.onPress(evt)
  }

  render(): JSX.Element {
    const {
      style,
      children,
      size,
      type,
      plain,
      disabled,
      loading,
      hoverStyle,
    } = this.props

    const isDefaultSize: boolean = size === 'default'
    const isDefaultType: boolean = type === 'default'
    const themeColorMap: { default: string[]; primary: string[]; warn: string[] } = {
      default: ['#F8F8F8', '#f7f7f7'],
      primary: ['#1AAD19', '#9ED99D'],
      warn: ['#E64340', '#EC8B89']
    }
    // Use themeColorMap normally as PLAIN is false (by default),
    // otherwise use rgb(53,53,53) for plain-default-type particularly.
    const themeColor: string =
      plain && isDefaultType ? `rgba(53,53,53,${disabled ? 0.6 : 1})` : themeColorMap[type][disabled ? 1 : 0]
    const backgroundColor: string = plain ? 'transparent' : themeColor
    const borderStyle: StyleProp<ViewStyle> = plain && { borderWidth: 1, borderColor: themeColor }
    const textColor: string = plain
      ? themeColor
      : isDefaultType
        ? `rgba(0,0,0,${disabled ? 0.3 : 1})`
        : `rgba(255,255,255,${disabled ? 0.6 : 1})`
    const textHoverStyle = this.state.isHover ? extracteTextStyle(hoverStyle) : {}

    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        onLongPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        ref={this.$touchable}
        disabled={disabled}
      >
        <View
          style={[
            styles.btn,
            !isDefaultSize && styles.btnMini,
            { backgroundColor },
            borderStyle,
            style,
            this.state.isHover && hoverStyle
          ]}
        >
          {loading && <Loading hasSibling={!!React.Children.count(children)} type={type} />}
          {
            Array.isArray(children) ? (
              children.map((c: never, i: number) => (
                <Text key={i} style={[styles.btnText, !isDefaultSize && styles.btnTextMini, { color: textColor }, textHoverStyle]}>
                  {c}
                </Text>
              ))
            ) : (['string', 'number'].indexOf(typeof children) > -1) ? (
              <Text style={[styles.btnText, !isDefaultSize && styles.btnTextMini, { color: textColor }, textHoverStyle]}>{children}</Text>
            ) : (
              children
            )}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Button
