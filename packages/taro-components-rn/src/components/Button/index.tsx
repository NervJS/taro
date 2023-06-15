/**
 * ✔ size
 * ✔ type
 * ✔ plain
 * ✔ disabled
 * ✔ loading
 * ✔ formType (form-type)
 * ✔ hoverStyle: Convert hoverClass to hoverStyle.
 * ✘ hoverStopPropagation
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 * ✔ onClick
 * - open-type
 * - lang
 * - bindgetuserinfo
 * - session-from
 * - send-message-title
 * - send-message-path
 * - send-message-img
 * - show-message-card
 * - bindcontact
 * - bindgetphonenumber
 * - bindchooseavatar
 * - app-parameter
 * - binderror
 * - bindopensetting
 *
 * Loading icon (svg): data:image/svg+xml;charset=utf8, <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><path fill='none' d='M0 0h100v100H0z'/><rect width='7' height='20' x='46.5' y='40' fill='%23E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/><rect width='7' height='20' x='46.5' y='40' fill='%23989697' rx='5' ry='5' transform='rotate(30 105.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%239B999A' rx='5' ry='5' transform='rotate(60 75.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23A3A1A2' rx='5' ry='5' transform='rotate(90 65 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23ABA9AA' rx='5' ry='5' transform='rotate(120 58.66 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23B2B2B2' rx='5' ry='5' transform='rotate(150 54.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23BAB8B9' rx='5' ry='5' transform='rotate(180 50 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23C2C0C1' rx='5' ry='5' transform='rotate(-150 45.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23CBCBCB' rx='5' ry='5' transform='rotate(-120 41.34 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23D2D2D2' rx='5' ry='5' transform='rotate(-90 35 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23DADADA' rx='5' ry='5' transform='rotate(-60 24.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23E2E2E2' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/></svg>
 * Loading icon for warn type (svg): data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect xmlns='http://www.w3.org/2000/svg' width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.56)' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.5)' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.43)' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.38)' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.32)' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.28)' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.25)' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.2)' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.17)' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.14)' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.1)' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.03)' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E
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
        accessibilityRole="button"
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
