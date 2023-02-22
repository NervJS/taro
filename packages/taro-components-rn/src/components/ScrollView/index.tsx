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
import {
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleSheet,
  ViewStyle
} from 'react-native'
import { omit, noop } from '../../utils'
import { ScrollViewProps, ScrollViewState, ScrollMetrics } from './PropsType'

// const SCROLLVIEW_CONT_STYLE = [
//   // Source code of ScrollView, ['alignItems','justifyContent']
//   'alignItems',
//   'justifyContent',
//   // Other
// ]

class _ScrollView extends React.Component<ScrollViewProps<any>, ScrollViewState> {
  static defaultProps = {
    upperThreshold: 50,
    lowerThreshold: 50,
    enableBackToTop: false
  }

  static getDerivedStateFromProps(props: ScrollViewProps<any>, state: ScrollViewState): ScrollViewState | null {
    return state.snapScrollTop !== props.scrollTop || state.snapScrollLeft !== props.scrollLeft
      ? {
        snapScrollTop: props.scrollTop || 0,
        snapScrollLeft: props.scrollLeft || 0
      }
      : null
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
    visibleLength: 0
  }

  $scrollView = React.createRef<any>()
  _hasDataChangedSinceEndReached: boolean
  _sentEndForContentLength = 0
  _scrollEventThrottle = 50
  _hasCallScrollToUpperInRange = true
  _hasCallScrollToLowerInRange = false
  _initialScrollIndexTimeout: any

  _selectLength = (metrics: { height: number; width: number }): number => {
    return !this.props.scrollX ? metrics.height : metrics.width
  }

  _selectOffset = (metrics: { x: number; y: number }): number => {
    return !this.props.scrollX ? metrics.y : metrics.x
  }

  _maybeCallOnStartReached = (): void => {
    const { onScrollToUpper, upperThreshold } = this.props
    const { offset } = this._scrollMetrics
    if (onScrollToUpper && offset <= upperThreshold) {
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
    // _hasDataChangedSinceEndReached的用处是???
    // if (onScrollToLower &&
    //     distanceFromEnd < lowerThreshold &&
    //     (this._hasDataChangedSinceEndReached || contentLength !== this._sentEndForContentLength)) {
    if (onScrollToLower && distanceFromEnd < lowerThreshold) {
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

  _onContentSizeChange = (width: number, height: number): void => {
    this._scrollMetrics.contentLength = this._selectLength({ height, width })
    // this._maybeCallOnStartReached()
    // this._maybeCallOnEndReached()
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
    // this._maybeCallOnStartReached()
    // this._maybeCallOnEndReached()
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
        deltaY: scrollTop - this._scrollMetrics.offsetY
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
      visibleLength
    }
    this._maybeCallOnStartReached()
    this._maybeCallOnEndReached()
  }

  scrollToOffset = (x = 0, y = 0): void => {
    const { scrollX, data, renderItem } = this.props
    const node = this.$scrollView.current
    if (node) {
      if (data && renderItem) {
        (node as FlatList<any>).scrollToOffset({ offset: scrollX ? x : y, animated: !!this.props.scrollWithAnimation })
      } else {
        (node as ScrollView).scrollTo({ x, y, animated: !!this.props.scrollWithAnimation })
      }
    }
  }

  componentDidMount(): void {
    if (this.state.snapScrollTop || this.state.snapScrollLeft) {
      this._initialScrollIndexTimeout = setTimeout(() => {
        this.scrollToOffset(this.state.snapScrollLeft, this.state.snapScrollTop)
      }, 0)
    }
  }

  getSnapshotBeforeUpdate(prevProps: ScrollViewProps<any>, prevState: ScrollViewState): boolean {
    if (prevProps.scrollTop !== undefined) {
      return (
        this._scrollMetrics.offsetY !== this.state.snapScrollTop ||
        this._scrollMetrics.offsetX !== this.state.snapScrollLeft
      )
    }
    return (
      prevState.snapScrollTop !== this.state.snapScrollTop || prevState.snapScrollLeft !== this.state.snapScrollLeft
    )
  }

  componentDidUpdate(_prevProps: ScrollViewProps<any>, _prevState: ScrollViewState, snapshot: boolean): void {
    if (snapshot) {
      this.scrollToOffset(this.state.snapScrollLeft, this.state.snapScrollTop)
    }
  }

  componentWillUnmount(): void {
    this._initialScrollIndexTimeout && clearTimeout(this._initialScrollIndexTimeout)
  }

  render(): JSX.Element {
    const { children, style, scrollX, enableBackToTop, contentContainerStyle, data, renderItem } = this.props

    const flattenStyle: ViewStyle & { [key: string]: any } = StyleSheet.flatten(style)
    const wrapperStyle: ViewStyle = omit(flattenStyle, ['alignItems', 'justifyContent'])
    const _contentContainerStyle: ViewStyle & { [key: string]: any } = {}
    if (flattenStyle) {
      flattenStyle.alignItems && (_contentContainerStyle.alignItems = flattenStyle.alignItems)
      flattenStyle.justifyContent && (_contentContainerStyle.justifyContent = flattenStyle.justifyContent)
    }

    const scrollElementProps = {
      horizontal: scrollX,
      onContentSizeChange: this._onContentSizeChange,
      onLayout: this._onLayout,
      onScroll: this._onScroll,
      onScrollEndDrag: this._onScrollEndDrag,
      onMomentumScrollEnd: this._onMomentumScrollEnd,
      scrollEventThrottle: this._scrollEventThrottle,
      scrollsToTop: !!enableBackToTop,
      style: wrapperStyle,
      contentContainerStyle: [_contentContainerStyle, contentContainerStyle],
      ...omit(this.props, [
        // props
        'style',
        'scrollX',
        'upperThreshold',
        'lowerThreshold',
        'scrollTop',
        'scrollLeft',
        'scrollWithAnimation',
        'enableBackToTop',
        'onScrollToUpper',
        'onScrollToLower',
        'onScroll',
        'contentContainerStyle',
        // SProps
        'horizontal',
        'onContentSizeChange',
        'onLayout',
        'onScroll',
        'onScrollEndDrag',
        'onMomentumScrollEnd',
        'scrollEventThrottle',
        'scrollsToTop',
        'style',
        'contentContainerStyle',
        'data',
        'renderItem',
        'keyExtractor'
      ]),
      ref: this.$scrollView
    }

    // eslint-disable-next-line multiline-ternary
    return data && renderItem ? (
      <FlatList
        {...scrollElementProps}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_item, index) => index + ''}
      />
    ) : (
      <ScrollView {...scrollElementProps}>{children}</ScrollView>
    )
  }
}

export default _ScrollView
