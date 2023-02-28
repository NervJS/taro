import * as React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { MovableAreaProps } from './PropsType'

class _MovableArea extends React.Component<MovableAreaProps, any> {
  static defaultProps = {}
  constructor(props: MovableAreaProps) {
    super(props)
    this.state = {
      width: this.props.width || 100,
      height: this.props.height || 100,
    }
  }

  _onLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout
    this.setState({
      width,
      height,
    })
  }

  render(): JSX.Element {
    const { style } = this.props
    const { width, height } = this.state
    return <View style={[{ height, width, overflow: 'hidden' }, style]} testID='moveableArea' onLayout={this._onLayout}>
      {React.cloneElement(this.props.children, { layout: { width, height } })}
    </View>
  }
}

export default _MovableArea
