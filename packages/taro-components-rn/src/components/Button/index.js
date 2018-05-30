/**
 * ✔ size
 * ✔ type
 * ✔ plain
 * ✔ disabled
 * ✔ loading
 * ✘ form-type
 * - open-type
 * ✘ hover-class
 * ✘ hover-stop-propagation
 * ✘ plain
 * ✘ hover-start-time
 * ✘ hover-stay-time
 * - lang
 * - bindgetuserinfo
 * - session-from
 * - send-message-title
 * - send-message-path
 * - send-message-img
 * - show-message-card
 * - bindcontact
 * - bindgetphonenumber
 * - app-parameter
 * - binderror
 * - bindopensetting
 * ✔ onClick
 *
 * Loading icon (svg): data:image/svg+xml;charset=utf8, <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><path fill='none' d='M0 0h100v100H0z'/><rect width='7' height='20' x='46.5' y='40' fill='%23E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/><rect width='7' height='20' x='46.5' y='40' fill='%23989697' rx='5' ry='5' transform='rotate(30 105.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%239B999A' rx='5' ry='5' transform='rotate(60 75.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23A3A1A2' rx='5' ry='5' transform='rotate(90 65 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23ABA9AA' rx='5' ry='5' transform='rotate(120 58.66 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23B2B2B2' rx='5' ry='5' transform='rotate(150 54.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23BAB8B9' rx='5' ry='5' transform='rotate(180 50 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23C2C0C1' rx='5' ry='5' transform='rotate(-150 45.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23CBCBCB' rx='5' ry='5' transform='rotate(-120 41.34 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23D2D2D2' rx='5' ry='5' transform='rotate(-90 35 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23DADADA' rx='5' ry='5' transform='rotate(-60 24.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='%23E2E2E2' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/></svg>
 * Loading icon for warn type (svg): data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect xmlns='http://www.w3.org/2000/svg' width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.56)' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.5)' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.43)' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.38)' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.32)' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.28)' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.25)' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.2)' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.17)' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.14)' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.1)' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.03)' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  size?: 'default' | 'mini',
  type?: 'primary' | 'default' | 'warn',
  plain?: boolean,
  disabled?: boolean,
  loading?: boolean,
  onClick?: Function,
}
type State = {
  valve: Animated.Value
}

class _Button extends Component<Props, State> {
  props: Props

  static defaultProps = {
    size: 'default',
    type: 'default'
  }

  state: State = {
    valve: new Animated.Value(0)
  }

  animate = () => {
    if (!this.props.loading) return

    Animated.sequence([
      Animated.timing(this.state.valve, {
        toValue: 1,
        easing: Easing.linear,
        duration: 1000
      }),
      Animated.timing(this.state.valve, {
        toValue: 0,
        duration: 0
      })
    ]).start(() => { this.animate() })
  }

  componentDidMount () {
    if (this.props.loading) {
      this.animate()
    }
  }

  componentDidUpdate (prevProps: Props) {
    if (!prevProps.loading && this.props.loading) {
      this.animate()
    }
  }

  render () {
    const {
      style,
      children,
      size,
      type,
      plain,
      disabled,
      loading,
      onClick,
    } = this.props

    const isDefaultSize = size === 'default'
    const isDefaultType = type === 'default'
    const themeColorMap = {
      default: ['#F8F8F8', '#f7f7f7'],
      primary: ['#1AAD19', '#9ED99D'],
      warn: ['#E64340', '#EC8B89'],
    }
    // Use themeColorMap normally as PLAIN is false (by default),
    // otherwise use rgb(53,53,53) for plain-default-type particularly.
    const themeColor = plain && isDefaultType ? `rgba(53,53,53,${disabled ? 0.6 : 1})` : themeColorMap[type][disabled ? 1 : 0]
    const backgroundColor = plain ? 'transparent' : themeColor
    const borderStyle = plain && { borderWidth: 1, borderColor: themeColor }
    const textColor = plain
      ? themeColor
      : (isDefaultType ? `rgba(0,0,0,${disabled ? 0.3 : 1})` : `rgba(255,255,255,${disabled ? 0.6 : 1})`)

    const rotateDeg = this.state.valve.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.6}
        onPress={onClick}
      >
        <View
          style={[
            styles.btn,
            !isDefaultSize && styles.btnMini,
            { backgroundColor },
            borderStyle,
            style
          ]}
        >
          {loading && (
            <Animated.View
              style={[styles.loading, { transform: [{ rotate: rotateDeg }] }]}
            >
              <Image
                source={type === 'warn' ? require('../../assets/loading-warn.png') : require('../../assets/loading.png')}
                style={styles.loadingImg}
              />
            </Animated.View>)
          }
          <Text
            style={[
              styles.btnText,
              !isDefaultSize && styles.btnTextMini,
              { color: textColor }
            ]}
          >
            {children}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default _Button
