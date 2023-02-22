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
  StyleSheet,
} from 'react-native'
import { noop } from '../../utils'
import { SwiperProps } from './PropsType'
import Carousel from './carousel'

class _Swiper extends React.Component<SwiperProps> {
  static defaultProps = {
    indicatorColor: 'rgba(0,0,0,0.3)',
    indicatorActiveColor: '#000',
    current: 0,
    interval: 5000,
  }

  onIndexChanged = (index: number): void => {
    const { onChange = noop, onAnimationFinish = noop } = this.props
    onChange({ detail: { current: index } })
    onAnimationFinish({ detail: { current: index } })
  }

  render(): any {
    const {
      children,
      style,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor,
      autoplay,
      current,
      interval,
      circular,
      vertical,
    } = this.props

    return (
      <Carousel
        style={StyleSheet.flatten(style)}
        dots={Boolean(indicatorDots)}
        dotStyle={{ backgroundColor: indicatorColor }}
        dotActiveStyle={{ backgroundColor: indicatorActiveColor }}
        autoplay={Boolean(autoplay)}
        selectedIndex={current}
        autoplayInterval={interval}
        infinite={Boolean(circular)}
        vertical={Boolean(vertical)}
        afterChange={this.onIndexChanged}
      >
        {children}
      </Carousel>
    )
  }
}

export default _Swiper
