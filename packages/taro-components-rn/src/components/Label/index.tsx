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
import { TouchableWithoutFeedback } from 'react-native'
import View from '../View'
import { LabelProps } from './PropsType'

class _Label extends React.Component<LabelProps> {
  hadFoundValidWidget = false
  $validWidget: any = null

  findValidWidget = (children: React.ReactNode): React.ReactNode => {
    if (this.hadFoundValidWidget) return children

    return React.Children.toArray(children).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (
        !this.hadFoundValidWidget &&
        (childTypeName === '_Checkbox' ||
          childTypeName === '_Button' ||
          childTypeName === '_Radio' ||
          childTypeName === '_Switch')
      ) {
        this.hadFoundValidWidget = true
        return React.cloneElement(
          child,
          {
            ...child.props,
            ref: (vw: React.ReactNode) => {
              this.$validWidget = vw
            }
          },
          child.props.children
        )
      }
      return React.cloneElement(child, { ...child.props }, this.findValidWidget(child.props.children))
    })
  }

  onPress = (): void => {
    this.$validWidget && this.$validWidget._simulateNativePress()
  }

  render (): JSX.Element {
    const { children, style } = this.props

    const mapChildren = this.findValidWidget(children)
    // Prepare for next rerender
    this.hadFoundValidWidget = false

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponderCapture={() => true}
          style={style}
        >
          {mapChildren}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Label
