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
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import { noop } from '../../utils'
import styles from './styles'
import { SliderProps, SliderState } from './PropsType'

class _Slider extends React.Component<SliderProps, SliderState> {
  static displayName = '_Slider'
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    activeColor: '#1aad19',
    backgroundColor: '#e9e9e9',
    blockColor: '#fff'
  }

  state: SliderState = {
    currentValue: this.props.value
  }

  componentDidUpdate(prevProps: SliderProps): void {
    if (prevProps.value !== this.props.value) {
      this.setState({
        currentValue: this.props.value
      })
    }
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
