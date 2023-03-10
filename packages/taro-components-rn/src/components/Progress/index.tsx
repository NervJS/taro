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
import {
  View,
  Text,
  Animated,
  Easing,
} from 'react-native'
import styles from './styles'
import { ProgressProps, ProgressState } from './PropsType'

export default class _Progress extends React.Component<ProgressProps, ProgressState> {
  static defaultProps = {
    percent: 0,
    strokeWidth: 6,
    activeColor: '#09BB07',
    backgroundColor: '#EBEBEB',
    activeMode: 'backwards',
    borderRadius: 0,
  }

  static getDerivedStateFromProps(props: ProgressProps, state: ProgressState): ProgressState | null {
    return props.percent !== state.percent ? {
      percent: props.percent,
      prevPercent: state.percent,
      valve: state.valve
    } : null
  }

  state: ProgressState = {
    percent: 0,
    prevPercent: 0,
    valve: new Animated.Value(0)
  }

  animate = (): void => {
    const { active, activeMode } = this.props
    const { percent, prevPercent, valve } = this.state
    const toValve = percent / 100

    if (!active || (activeMode !== 'backwards' && activeMode !== 'forwards')) {
      Animated.timing(valve, {
        toValue: toValve,
        duration: 0,
        useNativeDriver: false
      }).start()
      return
    }

    const sequence: Animated.CompositeAnimation[] = []
    const duration = (activeMode === 'forwards' ? Math.abs(percent - prevPercent) : percent) / 100 * 1000

    if (activeMode === 'backwards') {
      sequence.push(Animated.timing(valve, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false
      }))
    }
    sequence.push(Animated.timing(valve, {
      toValue: toValve,
      easing: Easing.linear,
      duration,
      useNativeDriver: false
    }))

    Animated.sequence(sequence).start()
  }

  componentDidMount(): void {
    this.animate()
  }

  getSnapshotBeforeUpdate(_prevProps: ProgressProps, prevState: ProgressState): boolean {
    return prevState.percent !== this.state.percent
  }

  componentDidUpdate(_prevProps: ProgressProps, _prevState: ProgressState, snapshot: boolean): void {
    if (snapshot) {
      this.animate()
    }
  }

  render(): JSX.Element {
    const {
      style,
      percent,
      showInfo,
      borderRadius,
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
              backgroundColor: activeColor,
              borderBottomRightRadius: Number(borderRadius),
              borderTopRightRadius: Number(borderRadius),
            }
          ]} />
        </View>
        {showInfo && <Text style={styles.info}>{percent}%</Text>}
      </View>
    )
  }
}
