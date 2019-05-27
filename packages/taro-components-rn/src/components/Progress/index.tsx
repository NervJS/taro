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
 */

import * as React from 'react'
import {
  View,
  Text,
  Animated,
  Easing,
} from 'react-native'
import styles from './styles'
import { ProgressProps, ProgressState } from './PropsType'

class _Progress extends React.Component<ProgressProps, ProgressState> {
  static defaultProps = {
    percent: 0,
    strokeWidth: 6,
    activeColor: '#09BB07',
    backgroundColor: '#EBEBEB',
    activeMode: 'backwards',
  }

  static getDerivedStateFromProps (props: ProgressProps, state: ProgressState) {
    return props.percent !== state.percent ? {
      percent: props.percent,
      prevPercent: state.percent
    } : null
  }

  state: ProgressState = {
    percent: 0,
    prevPercent: 0,
    valve: new Animated.Value(0)
  }

  animate = (): void => {
    const { active, activeMode } = this.props
    const { percent, prevPercent } = this.state
    const toValve = percent / 100

    if (!active || (activeMode !== 'backwards' && activeMode !== 'forwards')) {
      Animated.timing(this.state.valve, {
        toValue: toValve,
        duration: 0
      }).start()
      return
    }

    const sequence = []
    const duration = (activeMode === 'forwards' ? Math.abs(percent - prevPercent) : percent) / 100 * 1000

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
    this.animate()
  }

  getSnapshotBeforeUpdate (prevProps: ProgressProps, prevState: ProgressState) {
    return prevState.percent !== this.state.percent
  }

  componentDidUpdate (prevProps: ProgressProps, prevState: ProgressState, snapshot: boolean) {
    if (snapshot) {
      this.animate()
    }
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
