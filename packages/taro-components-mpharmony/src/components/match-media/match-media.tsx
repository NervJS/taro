import React, { PureComponent, ReactNode } from 'react'

interface Props {
  children: ReactNode
  minWidth?: number
  maxWidth?: number
  width?: number
  minHeight?: number
  maxHeight?: number
  height?: number
  orientation: string // 屏幕方向（landscape 或 portrait）

}

interface State {
  isAllSuit: boolean
}

export class MatchMedia extends PureComponent<Props,State> {
  context: unknown
  readonly props: Readonly<Props>
  refs: { [p: string]: React.ReactInstance }

  constructor (props) {
    super(props)
    this.state = {
      isAllSuit: true
    }
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {


    let isSuitMinWidth = true
    let isSuitMaxWidth = true

    let isSuitMinHeight = true
    let isSuitMaxHeight = true

    let isSuitWidth = true
    let isSuitHeight = true

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // console.log('screenWidth '+screenWidth+' screenHeight '+screenHeight)
    if (this.props.minWidth !== null && this.props.minWidth !== undefined) {
      isSuitMinWidth = screenWidth > this.props.minWidth
    }

    if (this.props.maxWidth !== null && this.props.maxWidth !== undefined) {
      isSuitMaxWidth = screenWidth < this.props.maxWidth
    }

    if (this.props.minHeight !== null && this.props.minHeight !== undefined) {
      isSuitMinHeight = screenHeight > this.props.minHeight
    }

    if (this.props.maxHeight !== null && this.props.maxHeight !== undefined) {
      isSuitMaxHeight = screenHeight < this.props.maxHeight
    }

    if (this.props.width !== null&& this.props.width !== undefined) {
      isSuitWidth = screenWidth === this.props.width
    }

    if (this.props.height !== null&& this.props.height !== undefined) {
      isSuitHeight = screenHeight === this.props.height
    }

    const isAllSuit = isSuitMinWidth && isSuitMaxWidth && isSuitMinHeight && isSuitMaxHeight && isSuitWidth && isSuitHeight

    // console.log('isSuitMinWidth ' + isSuitMinWidth + ' isSuitMaxWidth ' + isSuitMaxWidth + ' isSuitMinHeight ' + isSuitMinHeight + ' isSuitMaxHeight ' + isSuitMaxHeight + ' isSuitWidth ' + isSuitWidth + ' isSuitHeight ' + isSuitHeight)

    this.setState({ isAllSuit: isAllSuit })
  }

  render (): React.ReactNode {
    const { isAllSuit } = this.state
    return (isAllSuit ? this.props.children : null)
  }

}
