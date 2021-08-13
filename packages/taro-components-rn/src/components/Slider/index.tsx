/**
 * 半受控组件
 *
 * ✔ min
 * ✔ max
 * ✔ step
 * ✔ disabled
 * ✔ value
 * - color
 * - selected-color
 * ✔ activeColor
 * ✔ backgroundColor
 * ✘ blockSize(block-size)
 * ✔ blockColor(block-color)
 * ✔ showValue(show-value)
 * ✔ onChange(bindchange)
 * ✔ onChanging(bindchanging)
 */

import * as React from 'react'
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import { noop } from '../../utils'
import styles from './styles'
import { SliderProps, SliderState } from './PropsType'

class _Slider extends React.Component<SliderProps, SliderState> {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    activeColor: '#1aad19',
    backgroundColor: '#e9e9e9',
    blockColor: '#fff'
  }

  static getDerivedStateFromProps(props: SliderProps, state: SliderState): SliderState | null {
    return props.value !== state.currentValue
      ? {
        currentValue: props.value
      }
      : null
  }

  state: SliderState = {
    currentValue: 0
  }

  onSlidingComplete = (value: number): void => {
    const { onChange = noop } = this.props
    onChange({ detail: { value } })
  }

  onValueChange = (value: number): void => {
    const { onChanging = noop } = this.props
    onChanging({ detail: { value } })
    this.setState({ currentValue: value })
  }

  render(): JSX.Element {
    const { style, min, max, step, disabled, activeColor, backgroundColor, blockColor, showValue } = this.props
    // @todo dismember style
    return (
      <View style={styles.wrapper}>
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          disabled={!!disabled}
          value={this.state.currentValue}
          minimumTrackTintColor={activeColor}
          maximumTrackTintColor={backgroundColor}
          thumbTintColor={blockColor}
          onSlidingComplete={this.onSlidingComplete}
          onValueChange={this.onValueChange}
          style={[styles.bar, style as Record<string, unknown>]}
        />
        {showValue && <Text style={styles.info}>{this.state.currentValue}</Text>}
      </View>
    )
  }
}

export default _Slider
