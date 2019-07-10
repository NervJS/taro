/**
 * ScrollViewExperimental
 */

import * as React from 'react'
import {
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleSheet,
  ViewStyle,
  View,
  Text
} from 'react-native'
import { WaterfallList } from 'react-native-largelist-v3'
import { omit, noop } from '../../utils'
import { ScrollViewProps, ScrollViewState, ScrollMetrics } from './PropsTypeExperimental'

class _ScrollView extends React.Component<ScrollViewProps<any>, ScrollViewState> {
  static defaultProps = {
    upperThreshold: 50,
    lowerThreshold: 50,
    scrollTop: 0,
    scrollLeft: 0,
  }

  static getDerivedStateFromProps (props: ScrollViewProps<any>, state: ScrollViewState) {
    return state.snapScrollTop !== props.scrollTop || state.snapScrollLeft !== props.scrollLeft ? {
      snapScrollTop: props.scrollTop,
      snapScrollLeft: props.scrollLeft
    } : null
  }

  state: ScrollViewState = {
    snapScrollTop: 0,
    snapScrollLeft: 0
  }

  _scrollMetrics: ScrollMetrics = {
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
  $scrollView = React.createRef<WaterfallList<any>>()
  _hasDataChangedSinceEndReached: boolean
  _sentEndForContentLength: number = 0
  _scrollEventThrottle: number = 50
  _hasCallScrollToUpperInRange: boolean = false
  _hasCallScrollToLowerInRange: boolean = false
  _initialScrollIndexTimeout: any

  _selectLength = (metrics: { height: number, width: number }): number => {
    return !this.props.scrollX ? metrics.height : metrics.width
  }

  _selectOffset = (metrics: {x: number, y: number}): number => {
    return !this.props.scrollX ? metrics.y : metrics.x
  }

  _onContentSizeChange = (width: number, height: number): void => {
    this._scrollMetrics.contentLength = this._selectLength({ height, width })
  }

  _onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { velocity } = e.nativeEvent
    if (velocity) {
      this._scrollMetrics.velocity = this._selectOffset(velocity)
    }
  }

  _onMomentumScrollEnd = (): void => {
    this._scrollMetrics.velocity = 0
  }

  _onLayout = (e: LayoutChangeEvent): void => {
    this._scrollMetrics.visibleLength = this._selectLength(e.nativeEvent.layout)
  }

  _maybeCallOnStartReached = (): void => {
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

  _maybeCallOnEndReached = (): void => {
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

  _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { onScroll = noop } = this.props
    const scrollLeft: number = e.nativeEvent.contentOffset.x
    const scrollTop: number = e.nativeEvent.contentOffset.y
    const scrollHeight: number = e.nativeEvent.contentSize.height
    const scrollWidth: number = e.nativeEvent.contentSize.width
    onScroll({
      detail: {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth,
        deltaX: scrollLeft - this._scrollMetrics.offsetX,
        deltaY: scrollTop - this._scrollMetrics.offsetY,
      }
    })

    const timestamp: number = e.timeStamp
    const visibleLength: number = this._selectLength(e.nativeEvent.layoutMeasurement)
    const contentLength: number = this._selectLength(e.nativeEvent.contentSize)
    const offset: number = this._selectOffset(e.nativeEvent.contentOffset)
    const dt: number = Math.max(1, timestamp - this._scrollMetrics.timestamp)
    const dOffset: number = offset - this._scrollMetrics.offset
    const velocity: number = dOffset / dt
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

  scrollToOffset = (x: number = 0, y: number = 0): void => {
    const node = this.$scrollView.current
    node && node.scrollTo({ x, y })
  }

  componentDidMount () {
    if (this.state.snapScrollTop || this.state.snapScrollLeft) {
      this._initialScrollIndexTimeout = setTimeout(() => {
        this.scrollToOffset(this.state.snapScrollLeft, this.state.snapScrollTop)
      }, 0)
    }
  }

  getSnapshotBeforeUpdate (prevProps: ScrollViewProps<any>, prevState: ScrollViewState) {
    return prevState.snapScrollTop !== this.state.snapScrollTop || prevState.snapScrollLeft !== this.state.snapScrollLeft
  }

  componentDidUpdate (prevProps: ScrollViewProps<any>, prevState: ScrollViewState, snapshot: boolean) {
    if (snapshot) {
      this.scrollToOffset(this.state.snapScrollLeft, this.state.snapScrollTop)
    }
  }

  componentWillUnmount () {
    this._initialScrollIndexTimeout && clearTimeout(this._initialScrollIndexTimeout)
  }

  render () {
    const {
      style,
      data,
      heightForItem,
      renderHeader,
      renderFooter,
      renderItem,
      contentContainerStyle,
    } = this.props

    const flattenStyle: ViewStyle & { [key: string]: any } = StyleSheet.flatten(style)
    const wrapperStyle: ViewStyle = omit(flattenStyle, [
      'alignItems',
      'justifyContent'
    ])
    const _contentContainerStyle: ViewStyle & { [key: string]: any } = {}
    if (flattenStyle) {
      flattenStyle.alignItems && (_contentContainerStyle.alignItems = flattenStyle.alignItems)
      flattenStyle.justifyContent && (_contentContainerStyle.justifyContent = flattenStyle.justifyContent)
    }

    return (
      <WaterfallList
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        heightForItem={heightForItem}
        numColumns={2}
        renderItem={renderItem}
        // 参考 https://github.com/bolan9999/react-native-spring-scrollview/blob/master/src/NormalFooter.js
        // loadingFooter={loadingFooter}
        data={data}
        onScroll={this._onScroll}
        style={wrapperStyle}
        contentStyle={_contentContainerStyle}
        ref={this.$scrollView}
      />
    )
  }
}

export default _ScrollView
