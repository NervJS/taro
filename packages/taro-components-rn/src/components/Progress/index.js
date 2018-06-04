/**
 * ✔ percent
 * ✔ showInfo(show-info)
 * ✔ strokeWidth(stroke-width)
 * - color
 * ✔ activeColor
 * ✔ backgroundColor
 * ✔ active
 * ✔ activeMode(active-mode)
 *
 * @warn Height and width accept percentages after 0.42
 *
 * @example
 *  <Progress
 *    percent={this.state.progressPercent}
 *    showInfo={true}
 *    activeColor="orange"
 *    backgroundColor="pink"
 *    active={true}
 *    activeMode="forwards"
 *    style={{ marginTop: 10 }}
 *  />
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  percent: number,
  showInfo?: boolean,
  strokeWidth: number,
  activeColor: string,
  backgroundColor: string,
  active?: boolean,
  activeMode: 'backwards' | 'forwards',
}
type State = {
  valve: Animated.Value
}

class _Progress extends React.Component<Props, State> {
  props: Props
  state: State = {
    valve: new Animated.Value(0)
  }

  static defaultProps = {
    percent: 0,
    strokeWidth: 6,
    activeColor: '#09BB07',
    backgroundColor: '#EBEBEB',
    activeMode: 'backwards',
  }

  animate = (nextPercent: number = 0, nowPercent: number = 0) => {
    const { active, activeMode } = this.props
    const toValve = nextPercent / 100

    if (!active || (activeMode !== 'backwards' && activeMode !== 'forwards')) {
      Animated.timing(this.state.valve, {
        toValue: toValve,
        duration: 0
      }).start()
      return
    }

    const sequence = []
    const duration = (activeMode === 'forwards' ? Math.abs(nextPercent - nowPercent) : nextPercent) / 100 * 1000

    if (activeMode === 'backwards') {
      sequence.push(Animated.timing(this.state.valve, {
        toValue: 0,
        duration: 0
      }))
    }
    sequence.push(Animated.timing(this.state.valve, {
      toValue: toValve,
      easing: Easing.linear,
      duration
    }))

    Animated.sequence(sequence).start()
  }

  componentDidMount () {
    this.animate(this.props.percent)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    this.animate(nextProps.percent, this.props.percent)
  }

  render () {
    const {
      style,
      percent,
      showInfo,
      strokeWidth,
      activeColor,
      backgroundColor,
    } = this.props

    const width = this.state.valve.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    })

    return (
      <View style={[styles.wrapper, style]}>
        <View
          style={[
            styles.bar, {
              height: strokeWidth,
              backgroundColor
            }
          ]}
        >
          <Animated.View style={[
            styles.barThumb, {
              width,
              height: '100%',
              backgroundColor: activeColor
            }
          ]} />
        </View>
        {showInfo && <Text style={styles.info}>{percent}%</Text>}
      </View>
    )
  }
}

export default _Progress
