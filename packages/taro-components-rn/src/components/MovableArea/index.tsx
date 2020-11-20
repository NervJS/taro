import * as React from 'react'
import { View, LayoutChangeEvent } from 'react-native'
import { MovableAreaProps } from './PropsType'

class _MovableArea extends React.Component<MovableAreaProps, any> {
  static defaultProps = {}
  constructor(props: MovableAreaProps) {
    super(props)
    this.state = {
      child: null
    }
  }

  _onLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout
    const child = React.cloneElement(this.props.children, { layout: { width, height } })
    this.setState({
      width,
      height,
      child
    })
  }

  render(): JSX.Element {
    const { style, width = 100, height = 100 } = this.props
    const { child } = this.state
    return <View style={[{ height, width, overflow: 'hidden' }, style]} onLayout={this._onLayout}>{child}</View>
  }
}

export default _MovableArea
