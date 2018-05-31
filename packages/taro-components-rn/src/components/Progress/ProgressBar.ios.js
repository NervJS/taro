/**
 * @flow
 */

import React, { Component } from 'react'
import {
  ProgressViewIOS,
} from 'react-native'

type Props = {
  percent?: number,
  strokeWidth?: number,
  activeColor?: string,
  backgroundColor?: string,
  active?: boolean,
  activeMode?: 'backwards' | 'forwards',
}

class _ProgressBar extends Component<Props> {
  props: Props

  static defaultProps = {
    percent: 0,
    strokeWidth: 6,
    activeColor: '#09BB07',
    backgroundColor: '#EBEBEB',
    activeMode: 'backwards',
  }

  render () {
    const {
      percent,
      // strokeWidth,
      activeColor,
      backgroundColor,
      // active,
      // activeMode,
    } = this.props

    return (
      <ProgressViewIOS
        progress={percent / 100}
        progressTintColor={activeColor}
        trackTintColor={backgroundColor}
      />
    )
  }
}

export default _ProgressBar
