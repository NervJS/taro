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
