/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/**
 * ✘ for
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
