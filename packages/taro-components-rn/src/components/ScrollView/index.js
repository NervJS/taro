/**
 * ✘ scroll-x: Either-or
 * ✘ scroll-y: Either-or
 * ✔ upperThreshold(upper-threshold)
 * ✔ lowerThreshold(lower-threshold)
 * ✔ scrollTop(scroll-top)
 * ✔ scrollLeft(scroll-left)
 * ✘ scroll-into-view
 * ✔ scrollWithAnimation(scroll-with-animation)
 * ✔ enableBackToTop(enable-back-to-top)
 * ✔ onScrollToUpper(bindscrolltoupper)
 * ✔ onScrollToLower(bindscrolltolower)
 * ✔ onScroll(bindscroll)
 *
 * @flow
 */

import * as React from 'react'
import {
  ScrollView,
  StyleSheet,
} from 'react-native'
import { dismemberStyle, omit } from '../../utils'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  horizontal?: boolean,
  upperThreshold: number,
  lowerThreshold: number,
  scrollTop: number,
  scrollLeft: number,
  scrollWithAnimation?: boolean,
  enableBackToTop: boolean,
  onScrollToUpper?: Function,
  onScrollToLower?: Function,
  onScroll?: Function,
}

class _ScrollView extends React.Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
  }

  props: Props

  static defaultProps = {
    upperThreshold: 50,
    lowerThreshold: 50,
    scrollTop: 0,
    scrollLeft: 0,
    enableBackToTop: false,
  }

  _scrollMetrics = {
    contentLength: 0,
    dOffset: 0,
    dt: 10,
    offset: 0,
    offsetX: 0,
    offsetY: 0,
    timestamp: 0,
    velocity: 0,
    visibleLength: 0,
  }
  _scrollRef: any = null
  _captureScrollRef = (ref: any) => {
    this._scrollRef = ref
  }
  _hasDataChangedSinceEndReached: boolean
  _sentEndForContentLength: number = 0
  _scrollEventThrottle: number = 50
  _hasCallScrollToUpperInRange: boolean = false
  _hasCallScrollToLowerInRange: boolean = false
  _initialScrollIndexTimeout: any

  _selectLength = (metrics: { height: number, width: number }): number => {
    return !this.props.horizontal ? metrics.height : metrics.width
  }

  _selectOffset = (metrics: {x: number, y: number}): number => {
    return !this.props.horizontal ? metrics.y : metrics.x
  }

  _maybeCallOnStartReached = () => {
    const { onScrollToUpper, upperThreshold } = this.props
    const { offset } = this._scrollMetrics
    if (onScrollToUpper && offset < upperThreshold) {
      if (!this._hasCallScrollToUpperInRange) {
        onScrollToUpper({ distanceFromTop: offset })
        this._hasCallScrollToUpperInRange = true
      }
    } else {
      this._hasCallScrollToUpperInRange = false
    }
  }

  _maybeCallOnEndReached = () => {
    const { onScrollToLower, lowerThreshold } = this.props
    const { contentLength, visibleLength, offset } = this._scrollMetrics
    const distanceFromEnd = contentLength - visibleLength - offset
    if (onScrollToLower &&
        distanceFromEnd < lowerThreshold &&
        (this._hasDataChangedSinceEndReached || contentLength !== this._sentEndForContentLength)) {
      if (!this._hasCallScrollToLowerInRange) {
        this._hasDataChangedSinceEndReached = false
        this._hasCallScrollToLowerInRange = true
        this._sentEndForContentLength = this._scrollMetrics.contentLength
        onScrollToLower({ distanceFromEnd })
      }
    } else {
      this._hasCallScrollToLowerInRange = false
    }
  }

  _onContentSizeChange = (width: number, height: number) => {
    this._scrollMetrics.contentLength = this._selectLength({ height, width })
    this._maybeCallOnStartReached()
    this._maybeCallOnEndReached()
  }

  _onScrollEndDrag = (e: Object): void => {
    const { velocity } = e.nativeEvent
    if (velocity) {
      this._scrollMetrics.velocity = this._selectOffset(velocity)
    }
  }

  _onMomentumScrollEnd = (): void => {
    this._scrollMetrics.velocity = 0
  }

  _onLayout = (e: Object) => {
    this._scrollMetrics.visibleLength = this._selectLength(e.nativeEvent.layout)
    this._maybeCallOnStartReached()
    this._maybeCallOnEndReached()
  }

  _onScroll = (e: Object) => {
    const { onScroll } = this.props
    const scrollLeft = e.nativeEvent.contentOffset.x
    const scrollTop = e.nativeEvent.contentOffset.y
    const scrollHeight = e.nativeEvent.contentSize.height
    const scrollWidth = e.nativeEvent.contentSize.width
    onScroll && onScroll({
      detail: {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth,
        deltaX: scrollLeft - this._scrollMetrics.offsetX,
        deltaY: scrollTop - this._scrollMetrics.offsetY,
      }
    })

    const timestamp = e.timeStamp
    const visibleLength = this._selectLength(e.nativeEvent.layoutMeasurement)
    const contentLength = this._selectLength(e.nativeEvent.contentSize)
    const offset = this._selectOffset(e.nativeEvent.contentOffset)
    const dt = Math.max(1, timestamp - this._scrollMetrics.timestamp)
    const dOffset = offset - this._scrollMetrics.offset
    const velocity = dOffset / dt
    this._scrollMetrics = {
      contentLength,
      dt,
      dOffset,
      offset,
      offsetX: scrollLeft,
      offsetY: scrollTop,
      timestamp,
      velocity,
      visibleLength,
    }
    this._maybeCallOnStartReached()
    this._maybeCallOnEndReached()
  }

  scrollToOffset = (x: number = 0, y: number = 0) => {
    this._scrollRef.scrollTo({ x, y, animated: !!this.props.scrollWithAnimation })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (nextProps.scrollTop !== this.props.scrollTop || nextProps.scrollLeft !== this.props.scrollLeft) {
      this.scrollToOffset(nextProps.scrollLeft, nextProps.scrollTop)
    }
  }

  // componentWillReceiveProps (nextProps: Props) {
  //   const { data, extraData, getItemCount, maxToRenderPerBatch } = nextProps
  //   if (data !== this.props.data) {
  //     this._hasDataChangedSinceEndReached = true
  //   }
  // }

  componentDidMount () {
    if (this.props.scrollTop || this.props.scrollLeft) {
      this._initialScrollIndexTimeout = setTimeout(() => {
        this.scrollToOffset(this.props.scrollLeft, this.props.scrollTop)
      }, 0)
    }
  }

  componentWillUnmount () {
    this._initialScrollIndexTimeout && clearTimeout(this._initialScrollIndexTimeout)
  }

  render () {
    const {
      children,
      style,
      enableBackToTop,
    } = this.props

    const dismember = dismemberStyle(style)
    const wrapperStyle = Object.assign(dismember.wrapperStyle, { height: dismember.innerStyle.height })
    const innerStyle = omit(dismember.innerStyle, [ 'height' ])

    return (
      <ScrollView
        onContentSizeChange={this._onContentSizeChange}
        onLayout={this._onLayout}
        onScroll={this._onScroll}
        onScrollEndDrag={this._onScrollEndDrag}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        ref={this._captureScrollRef}
        scrollEventThrottle={this._scrollEventThrottle}
        scrollsToTop={!!enableBackToTop}
        style={[{ flexGrow: 0 }, wrapperStyle]}
        contentContainerStyle={innerStyle}
      >
        {children}
      </ScrollView>
    )
  }
}

export default _ScrollView
