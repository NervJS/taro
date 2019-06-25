/**
 * react-native-swiper
 *
 * react-native >= 0.55.4
 * react >= 16.3.1
 *
 * 组件由 `react-native-swiper` 修改而来
 *
 * @author leecade<leecade@163.com>
 * @author Manjiz<https://github.com/Manjiz>
 */

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  InteractionManager,
} from 'react-native'
import { ReactNativeSwiperProps, ReactNativeSwiperState, Offset, ScrollEventSim } from './PropsType'
import { noop } from '../../utils'
import styles from './styles'

const isAndroid = Platform.OS === 'android'

const getOffset = (dir: 'x'|'y', index: number, width: number, height: number): Offset => {
  const tmp: Offset = { x: 0, y: 0 }
  tmp[dir] = (dir === 'x' ? width : height) * index
  return tmp
}

export default class extends Component<ReactNativeSwiperProps, ReactNativeSwiperState> {
  /**
   * @see http://facebook.github.io/react-native/docs/scrollview.html
   */
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    removeClippedSubviews: true,
    showsPagination: true,
    loop: true,
    loadMinimalSize: 1,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    index: 0,

    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    automaticallyAdjustContentInsets: false,
  }

  static getDerivedStateFromProps (props: ReactNativeSwiperProps, state: ReactNativeSwiperState) {
    const initState: any = {
      autoplayEnd: false,
      loopJump: false,
      offset: {}
    }

    initState.total = props.children ? props.children.length || 1 : 0

    const updateIndex = state.pIndex !== props.index

    if (state.total === initState.total && !updateIndex) {
      // retain the index
      initState.index = state.index
    } else {
      initState.index = initState.total > 1 ? Math.min(props.index as number, initState.total - 1) : 0
      initState.pIndex = props.index as number
    }

    const { width, height } = Dimensions.get('window')

    initState.dir = props.horizontal ? 'x' : 'y'
    initState.width = props.width || state.width || width
    initState.height = props.height || state.height || height
    initState.offset[initState.dir] = (initState.dir === 'x' ? initState.width : initState.height) * (props.index as number + (props.loop ? 1 : 0))

    return initState
  }

  state: ReactNativeSwiperState = {
    width: 0,
    height: 0,
    offset: { x: 0, y: 0 },
    total: 0,
    pIndex: 0,
    index: 0,
    dir: 'x',
  }

  autoplayTimer: any
  loopJumpTimer: any
  autoScrolling: boolean = false
  scrolling: boolean = false
  scrollAnimated: boolean = false
  realtimeOffset: Partial<Offset> = { x: 0, y: 0 }
  onAndroidScrollEndTimer: any

  $scrollView: any = React.createRef<ScrollView>()

  componentDidMount () {
    this.autoplay()
  }

  componentDidUpdate (prevProps: ReactNativeSwiperProps, prevState: ReactNativeSwiperState) {
    const shouldClearAutoPlay = !this.props.autoplay && this.autoplayTimer
    const indexChanged = prevState.index !== this.state.index
    this.scrolling = false
    shouldClearAutoPlay && clearTimeout(this.autoplayTimer as number)
    // If the index has changed, we notify the parent via the onIndexChanged callback
    if (indexChanged) {
      const { onIndexChanged = noop } = this.props
      onIndexChanged(this.state.index)
    }
    const { dir } = this.state
    if (prevState.offset !== this.state.offset && prevState.offset[dir] !== this.state.offset[dir]) {
      const node = this.$scrollView.current
      // workaround-1: android scrollTo not work after offset changed. (In real device)
      // Android scrollTo didn't trigger onMomentumScrollEnd.
      node && node.scrollTo({
        ...this.state.offset,
        animated: isAndroid || this.scrollAnimated,
        duration: this.scrollAnimated ? 500 : 1
      })
    }
  }

  componentWillUnmount () {
    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.loopJumpTimer && clearTimeout(this.loopJumpTimer)
    this.onAndroidScrollEndTimer && clearTimeout(this.onAndroidScrollEndTimer)
  }

  /**
   * Reset index and autoplay if contentSizeChange.
   */
  onContentSizeChange = (contentWidth: number, contentHeight: number): void => {
    const { loop } = this.props
    const { width, total, height, dir } = this.state
    const offset: Offset = getOffset(dir, loop && total > 1 ? 1 : 0, width, height)
    this.realtimeOffset = offset
    this.setState({ index: 0, offset }, () => {
      this.autoplay()
      // workaround-2: In android,
      if (isAndroid) {
        const node = this.$scrollView.current
        node && node.scrollTo(offset)
      }
    })
  }

  fullState () {
    return Object.assign({}, this.state, { offset: this.realtimeOffset })
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { loop } = this.props
    const {
      index,
      total,
      dir,
      width,
      height,
    } = this.state
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout
    // const layoutWidth = Math.round(event.nativeEvent.layout.width)
    // const layoutHeight = Math.round(event.nativeEvent.layout.height)
    let offsetWouldBeSet: Partial<Offset> = this.realtimeOffset = {}
    const stateWouldBeSet: any = { width: layoutWidth, height: layoutHeight }

    if (total > 1) {
      let actualIndex = index
      loop && actualIndex++
      offsetWouldBeSet = getOffset(dir, actualIndex, layoutWidth, layoutHeight)
    }

    // only update the offset in state if needed, updating offset while swiping
    // causes some bad jumping / stuttering
    if (layoutWidth !== width || layoutHeight !== height) {
      stateWouldBeSet.offset = offsetWouldBeSet
    }

    this.setState(stateWouldBeSet)
  }

  /**
   * Scroll by index
   */
  scrollBy = (step: number, animated: boolean = true) => {
    const { loop } = this.props
    const { dir, width, height, index, total } = this.state
    if (this.scrolling || total < 2) return
    const actualIndex  = (loop ? 1 : 0) + index
    const newActualIndex = actualIndex + step
    let x = 0
    let y = 0
    dir === 'x' ? (x = newActualIndex * width) : (y = newActualIndex * height)

    this.scrolling = true
    this.autoScrolling = true
    this.scrollAnimated = animated
    this.setState({
      offset: { x, y },
      autoplayEnd: false
    }, () => {
      this.scrollAnimated = false
    })
  }

  /**
   * Automatic rolling
   */
  autoplay = () => {
    const {
      children,
      autoplay,
      autoplayTimeout,
      loop,
      autoplayDirection
    } = this.props
    const { index, total, autoplayEnd } = this.state
    if (!Array.isArray(children) || !autoplay || this.scrolling || autoplayEnd) return

    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.autoplayTimer = setTimeout(() => {
      if (!loop && (autoplayDirection ? index === total - 1 : index === 0)) {
        return this.setState({ autoplayEnd: true })
      } else {
        this.scrollBy(autoplayDirection ? 1 : -1)
      }
    }, (autoplayTimeout as number) * 1000)
  }

  /**
   * Scroll begin handle
   */
  onScrollBegin = (e?: ScrollEventSim) => {
    const { onScrollBeginDrag = noop } = this.props
    this.scrolling = true
    onScrollBeginDrag(e, this.fullState(), this)
  }

  /**
   * workaround-3: Android didn't trigger onMomentumScrollEnd after scrollTo().
   */
  onScroll = (e: ScrollEventSim) => {
    if (isAndroid && this.autoScrolling) {
      const contentOffset = e.nativeEvent.contentOffset
      const { dir, offset } = this.state
      if (Math.abs(Math.round(contentOffset[dir]) - Math.round(offset[dir])) < 2) {
        this.onAndroidScrollEndTimer && clearTimeout(this.onAndroidScrollEndTimer)
        // Protect nativeEvent object.
        const tmpEvent: ScrollEventSim = { nativeEvent: { contentOffset: { x: contentOffset.x, y: contentOffset.y } } }
        this.onAndroidScrollEndTimer = setTimeout(() => {
          this.onScrollEnd(tmpEvent)
        }, 50)
      }
    }
  }

  /**
   * Scroll end handle
   */
  onScrollEnd = (e: ScrollEventSim) => {
    const { onMomentumScrollEnd = noop } = this.props

    this.scrolling = false
    this.autoScrolling = false

    // making our events coming from android compatible to updateIndex logic
    const contentOffset = e.nativeEvent.contentOffset

    this.updateIndexByOffset(contentOffset, () => {
      this.autoplay()

      // if `onMomentumScrollEnd` registered will be called here
      onMomentumScrollEnd(e, this.fullState(), this)
    })
  }

  /*
   * Drag end handle
   */
  onScrollEndDrag = (e: ScrollEventSim) => {
    const { horizontal, children } = this.props
    const { index } = this.state
    const { contentOffset } = e.nativeEvent
    const previousOffset = horizontal ? this.realtimeOffset.x : this.realtimeOffset.y
    const newOffset = horizontal ? contentOffset.x : contentOffset.y

    if (previousOffset === newOffset && (index === 0 || index === children.length - 1)) {
      this.scrolling = false
    }
  }

  /**
   * Update index after scroll
   */
  updateIndexByOffset = (contentOffset: Offset, cb: any) => {
    const { loop } = this.props
    let { index, dir, width, height, total } = this.state

    // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
    !this.realtimeOffset && (this.realtimeOffset = {})

    const diff = (contentOffset[dir] || 0) - (this.realtimeOffset[dir] || 0)
    const step = dir === 'x' ? width : height
    let loopJump = false

    // Do nothing if offset no change.
    if (!diff) return

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    // parseInt() ensures it's always an integer
    // index = parseInt(index + Math.round(diff / step) + '')
    let actualIndex = parseInt(Math.round((contentOffset[dir] || 0) / step) + '')

    if (loop) {
      if (actualIndex === 0) {
        index = total - 1
        contentOffset[dir] = step * total
        loopJump = true
      } else if (actualIndex === total + 1) {
        index = 0
        contentOffset[dir] = step
        loopJump = true
      } else {
        index = actualIndex - 1
      }
    }

    const stateWouldBeSet: any = { index, loopJump }

    this.realtimeOffset = contentOffset

    // only update offset in state if loopJump is true
    if (loopJump) {
      // when swiping to the beginning of a looping set for the third time,
      // the new offset will be the same as the last one set in state.
      // Setting the offset to the same thing will not do anything,
      // so we increment it by 1 then immediately set it to what it should be,
      // after render.
      if (contentOffset[dir] === this.realtimeOffset[dir]) {
        stateWouldBeSet.offset = { x: 0, y: 0 }
        stateWouldBeSet.offset[dir] = (contentOffset[dir] || 0) + 1
        this.setState(stateWouldBeSet, () => {
          this.setState({ offset: contentOffset }, cb)
        })
      } else {
        stateWouldBeSet.offset = contentOffset
        this.setState(stateWouldBeSet, cb)
      }
    } else {
      this.setState(stateWouldBeSet, cb)
    }
  }

  scrollViewPropOverrides = () => {
    const overrides: any = {}

    for (let prop in this.props) {
      // if(~scrollResponders.indexOf(prop)
      if (
        typeof this.props[prop as keyof ReactNativeSwiperProps] === 'function'
        && prop !== 'onMomentumScrollEnd'
        && prop !== 'renderPagination'
        && prop !== 'onScrollBeginDrag'
      ) {
        const originResponder = this.props[prop as keyof ReactNativeSwiperProps] || noop
        overrides[prop] = (e: any) => originResponder(e, this.fullState(), this)
      }
    }

    return overrides
  }

  /**
   * Render pagination
   * By default, dots only show when `total` >= 2
   */
  renderPagination = (): React.ReactNode => {
    if (this.state.total <= 1) return null

    const dots = []
    const ActiveDot = this.props.activeDot || (
      <View
        style={[{
          backgroundColor: this.props.activeDotColor || '#007aff',
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3
        }, this.props.activeDotStyle]}
      />
    )

    const Dot = this.props.dot || (
      <View
        style={[{
          backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3
        }, this.props.dotStyle ]}
      />
    )

    for (let i = 0; i < this.state.total; i++) {
      dots.push(i === this.state.index
        ? React.cloneElement(ActiveDot, { key: i })
        : React.cloneElement(Dot, { key: i })
      )
    }

    return (
      <View pointerEvents='none' style={[styles[this.state.dir === 'x' ? `pagination_x` : `pagination_y`], this.props.paginationStyle]}>
        {dots}
      </View>
    )
  }

  renderScrollView = (pages: any) => {
    return (
      <ScrollView
        {...this.props}
        {...this.scrollViewPropOverrides()}
        contentContainerStyle={[styles.wrapper, this.props.style]}
        // contentOffset={this.state.offset}
        onContentSizeChange={this.onContentSizeChange}
        onMomentumScrollEnd={this.onScrollEnd}
        onScrollBeginDrag={this.onScrollBegin}
        onScrollEndDrag={this.onScrollEndDrag}
        onScroll={this.onScroll}
        scrollEventThrottle={50}
        style={this.props.scrollViewStyle}
        ref={this.$scrollView}
      >
        {pages}
      </ScrollView>
    )
  }

  /**
   * Default render
   */
  render () {
    const {
      index,
      total,
      width,
      height
    } = this.state
    const {
      children,
      containerStyle,
      loop,
      loadMinimal,
      loadMinimalSize,
      loadMinimalLoader,
      renderPagination,
      showsPagination,
    } = this.props
    // let dir = state.dir
    // let key = 0
    const loopVal = loop ? 1 : 0
    let pages: Element[] | Element = []

    const pageStyle = [{ width, height }, styles.slide]
    const pageStyleLoading: any = {
      width,
      height,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }

    // For make infinite at least total > 1
    if (total > 1) {
      // Re-design a loop model for avoid img flickering
      const pagesKeys = Object.keys(children)
      if (loop) {
        pagesKeys.unshift(total - 1 + '')
        pagesKeys.push('0')
      }

      pages = pagesKeys.map((pageIdx: string, i: number) => {
        if (loadMinimal) {
          if (i >= (index + loopVal - (loadMinimalSize as number)) &&
            i <= (index + loopVal + (loadMinimalSize as number))) {
            return <View style={pageStyle} key={i}>{children[parseInt(pageIdx)]}</View>
          } else {
            return (
              <View
                style={pageStyleLoading}
                key={i}
              >
                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
              </View>
            )
          }
        } else {
          return <View style={pageStyle} key={i}>{children[parseInt(pageIdx)]}</View>
        }
      })
    } else {
      pages = <View style={pageStyle} key={0}>{children}</View>
    }

    return (
      <View
        onLayout={this.onLayout}
        style={[styles.container, containerStyle]}
      >
        {this.renderScrollView(pages)}
        {showsPagination && (renderPagination ? renderPagination(index, total, this) : this.renderPagination())}
      </View>
    )
  }
}
