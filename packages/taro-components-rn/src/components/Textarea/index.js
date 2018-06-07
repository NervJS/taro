/**
 * Compared with Input:
 *  Subtraction:
 *    type, password, confirmType, confirmHold
 *  Addition:
 *    ✔ autoHeight(auto-height)
 *    ✘ fixed
 *    ✘ show-confirm-bar
 *    ✔ onLineChange(bindlinechange)
 *
 * @flow
 */

import * as React from 'react'
import Input from '../Input'
import { omit } from '../../utils'

type Props = {
  // ...Input Props
  autoHeight?: boolean,
  onLineChange?: Function,
}

class _Textarea extends React.Component<Props> {
  props: Props

  static defaultProps = {
  }

  render () {
    const {
      autoHeight,
      onLineChange,
    } = this.props

    return (
      <Input
        {...omit(this.props, [
          'type',
          'password',
          'confirmType',
          'confirmHold',
        ])}
        _multiline={true}
        _autoHeight={autoHeight}
        _onLineChange={onLineChange}
      />
    )
  }
}

export default _Textarea
