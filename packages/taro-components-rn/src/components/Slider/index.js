/**
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
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  Text,
  Slider,
  StyleSheet,
} from 'react-native'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  min: number,
  max: number,
  step: number,
  disabled?: boolean,
  value: number,
  activeColor: string | number,
  backgroundColor: string | number,
  blockColor: string | number,
  showValue?: boolean,
  onChange?: Function,
  onChanging?: Function,
}
type State = {
  currentValue: number
}

class _Slider extends React.Component<Props, State> {
  props: Props
  state: State = {
    currentValue: this.props.value
  }

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    activeColor: '#1aad19',
    backgroundColor: '#e9e9e9',
    blockColor: '#fff',
  }

  onSlidingComplete = (value: number) => {
    const { onChange } = this.props
    onChange && onChange({ detail: { value } })
  }

  onValueChange = (value: number) => {
    const { onChanging } = this.props
    onChanging && onChanging({ detail: { value } })
    this.setState({ currentValue: value })
  }

  render () {
    const {
      style,
      min,
      max,
      step,
      disabled,
      value,
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
          value={value}
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
