/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react'
import { PanResponder, Animated, LayoutChangeEvent } from 'react-native'
import View from '../View'
import { AnimatedValueProps, MovableViewProps } from './PropsType'

class _MovableView extends React.Component<MovableViewProps, any> {
  static defaultProps = {
    direction: 'none',
    onDragStart: (): void => {},
    onDragEnd: (): void => {},
    onChange: (): void => {},
    disabled: false,
    animation: true
  }

  panResponder: any
  $ref: any = React.createRef();
  W: any;
  H: any;
  constructor(props: MovableViewProps) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY(),
      disabled: props.disabled,
      xOffset: 0,
      yOffset: 0
    }
    this.createPanResponder()
  }

  createPanResponder = (): void => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => !this.state.disabled,
      onMoveShouldSetPanResponderCapture: () => !this.state.disabled,
      onPanResponderGrant: () => {
        const { pan } = this.state
        pan.setOffset({ x: pan.x._value, y: pan.y._value })
        this.props.onDragStart && this.props.onDragStart()
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [
            null,
            {
              ...(this.props.direction !== 'none' && this.props.direction !== 'vertical' ? { dx: this.state.pan.x } : {}),
              ...(this.props.direction !== 'none' && this.props.direction !== 'horizontal' ? { dy: this.state.pan.y } : {}),
            }
          ],
          {
            useNativeDriver: false
          }
        )(e, gestureState)
        this.props.onChange && this.props.onChange(e)
      },
      onPanResponderRelease: () => {
        const { pan } = this.state
        const { layout = { width: 0, height: 0 } } = this.props
        this.state.pan.flattenOffset()
        const x = pan.x._value > layout.width - this.W ? layout.width - this.W : pan.x._value < 0 ? 0 : pan.x._value
        const y = pan.y._value > layout.height - this.H ? layout.height - this.H : pan.y._value < 0 ? 0 : pan.y._value
        Animated.spring(this.state.pan, {
          toValue: { x: x, y: y },
          useNativeDriver: false
        }).start()
        this.props.onDragEnd && this.props.onDragEnd()
      }
    })
  }

  componentDidMount(): void {
    const { pan } = this.state
    const { onMove } = this.props
    if (typeof onMove === 'function') pan.addListener((values: AnimatedValueProps) => onMove(values))
  }

  componentWillUnmount(): void {
    const { pan } = this.state
    pan.removeAllListeners()
  }

  changeDisableStatus = (): void => {
    const { disabled } = this.state
    this.setState({
      disabled: !disabled
    })
  }

  _onLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout
    this.W = width
    this.H = height
  }

  render(): JSX.Element {
    const { style } = this.props
    return (
      <Animated.View ref={this.$ref} onLayout={this._onLayout} {...this.panResponder.panHandlers} style={[style, this.state.pan.getLayout()]}>
        <View>{this.props.children}</View>
      </Animated.View>
    )
  }
}

export default _MovableView
