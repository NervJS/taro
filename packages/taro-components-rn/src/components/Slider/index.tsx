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
import {
  View,
  Text,
  Slider,
} from 'react-native'
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
    blockColor: '#fff',
  }

  static getDerivedStateFromProps (props: SliderProps, state: SliderState) {
    return props.value !== state.currentValue ? {
      currentValue: props.value
    } : null
  }

  state: SliderState = {
    currentValue: 0
  }

  onSlidingComplete = (value: number) => {
    const { onChange = noop } = this.props
    onChange({ detail: { value } })
  }

  onValueChange = (value: number) => {
    const { onChanging = noop } = this.props
    onChanging({ detail: { value } })
    this.setState({ currentValue: value })
  }

  render () {
    const {
      style,
      min,
      max,
      step,
      disabled,
      activeColor,
      backgroundColor,
      blockColor,
      showValue,
    } = this.props

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
          style={[styles.bar, style]}
        />
        {showValue && <Text style={styles.info}>{this.state.currentValue}</Text>}
      </View>
    )
  }
}

export default _Slider
