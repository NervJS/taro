/**
 * react-native-swiper
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
} from 'react-native'
import { ReactNativeSwiperProps, ReactNativeSwiperState } from './PropsType'
import { noop } from '../../utils'
import styles from './styles'

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

    initState.offset[initState.dir] = (initState.dir === 'y' ? height : width) * (props.index as number)

    return initState
  }

  state: ReactNativeSwiperState = {
    width: 0,
    height: 0,
    offset: { x: 0, y: 0 },
    total: 0,
    pIndex: 0,
    index: 0,
    dir: 'x'
  }
  initialRender: boolean = true
  autoplayTimer: any
  loopJumpTimer: any
  internals: {
    isScrolling: boolean;
    offset: Partial<{
      x: number;
      y: number;
    }>
  } = {
    isScrolling: false,
    offset: {
      x: 0,
      y: 0
    }
  }
  $scrollView: any = React.createRef<ScrollView>()

  getSnapshotBeforeUpdate (prevProps: ReactNativeSwiperProps, prevState: ReactNativeSwiperState) {
    this.internals.isScrolling = false
    return {
      shouldClearAutoPlay: !this.props.autoplay && this.autoplayTimer,
      ifIndexChange: prevState.index !== this.state.index
    }
  }

  componentDidUpdate (prevProps: ReactNativeSwiperProps, prevState: ReactNativeSwiperState, snapshot: { shouldClearAutoPlay: boolean; ifIndexChange: boolean; }) {
    if (snapshot.shouldClearAutoPlay) {
      clearTimeout(this.autoplayTimer as number)
    }
    // If the index has changed, we notify the parent via the onIndexChanged callback
    if (snapshot.ifIndexChange) {
      const { onIndexChanged = noop } = this.props
      onIndexChanged(this.state.index)
    }
  }

  componentDidMount () {
    this.autoplay()
  }

  componentWillUnmount () {
    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.loopJumpTimer && clearTimeout(this.loopJumpTimer)
  }

  /**
   * include internals with state
   */
  fullState () {
    return { ...this.state, ...this.internals }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { loop } = this.props
    const {
      index,
      total,
      dir,
      width,
      height,
      offset
    } = this.state
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout
    const offsetWouldBeSet: { x?: number; y?: number; } = this.internals.offset = {}
    const stateWouldBeSet: any = { width: layoutWidth, height: layoutHeight }

    if (total > 1) {
      let setup = index
      loop && setup++
      offsetWouldBeSet[dir] = dir === 'y' ? layoutHeight * setup : layoutWidth * setup
    }

    // only update the offset in state if needed, updating offset while swiping
    // causes some bad jumping / stuttering
    if (!offset || layoutWidth !== width || layoutHeight !== height) {
      stateWouldBeSet.offset = offsetWouldBeSet
    }

    // related to https://github.com/leecade/react-native-swiper/issues/570
    // contentOffset is not working in react 0.48.x so we need to use scrollTo
    // to emulate offset.
    if (this.initialRender && total > 1) {
      const node = this.$scrollView.current
      node && (node as ScrollView).scrollTo({ ...offsetWouldBeSet, animated: false })
      this.initialRender = false
    }

    this.setState(stateWouldBeSet)
  }

  loopJump = () => {
    // Android doesn't support contentOffset, So...
    if (Platform.OS === 'android' && this.props.loop) {
      const { index, total } = this.state
      if (index !== 0 && index !== total - 1) return
      const node = this.$scrollView.current
      node && node.scrollTo(this.internals.offset)
    }
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
    if (!Array.isArray(children) || !autoplay || this.internals.isScrolling || autoplayEnd) return

    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.autoplayTimer = setTimeout(() => {
      if (!loop && (autoplayDirection ? index === total - 1 : index === 0)) {
        return this.setState({ autoplayEnd: true })
      }

      this.scrollBy(autoplayDirection ? 1 : -1)
    }, (autoplayTimeout as number) * 1000)
  }

  /**
   * Scroll begin handle
   */
  onScrollBegin = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { onScrollBeginDrag = noop } = this.props
    // update scroll state
    this.internals.isScrolling = true
    onScrollBeginDrag(e, this.fullState(), this)
  }

  /**
   * Scroll end handle
   */
  onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { onMomentumScrollEnd = noop } = this.props
    const { dir } = this.state

    // update scroll state
    this.internals.isScrolling = false

    let contentOffset
    // making our events coming from android compatible to updateIndex logic
    contentOffset = (e as NativeSyntheticEvent<NativeScrollEvent>).nativeEvent.contentOffset

    this.updateIndex(contentOffset, dir, () => {
      this.autoplay()
      this.loopJump()

      // if `onMomentumScrollEnd` registered will be called here
      onMomentumScrollEnd(e, this.fullState(), this)
    })
  }

  /*
   * Drag end handle
   */
  onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { horizontal, children } = this.props
    const { index } = this.state
    const { contentOffset } = e.nativeEvent
    const { offset } = this.internals
    const previousOffset = horizontal ? offset.x : offset.y
    const newOffset = horizontal ? contentOffset.x : contentOffset.y

    if (previousOffset === newOffset && (index === 0 || index === children.length - 1)) {
      this.internals.isScrolling = false
    }
  }

  /**
   * Update index after scroll
   */
  updateIndex = (offset: { x?: number; y?: number }, dir: 'x'|'y', cb: any) => {
    const { loop } = this.props
    let { index, width, height, total } = this.state

    // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
    if (!this.internals.offset) {
      this.internals.offset = {}
    }

    const diff = (offset[dir] || 0) - (this.internals.offset[dir] || 0)
    const step = dir === 'x' ? width : height
    let loopJump = false

    // Do nothing if offset no change.
    if (!diff) return

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    // parseInt() ensures it's always an integer
    index = parseInt(index + Math.round(diff / step) + '')

    if (loop) {
      if (index <= -1) {
        index = total - 1
        offset[dir] = step * total
        loopJump = true
      } else if (index >= total) {
        index = 0
        offset[dir] = step
        loopJump = true
      }
    }

    const stateWouldBeSet: any = { index, loopJump }

    this.internals.offset = offset

    // only update offset in state if loopJump is true
    if (loopJump) {
      // when swiping to the beginning of a looping set for the third time,
      // the new offset will be the same as the last one set in state.
      // Setting the offset to the same thing will not do anything,
      // so we increment it by 1 then immediately set it to what it should be,
      // after render.
      if (offset[dir] === this.internals.offset[dir]) {
        stateWouldBeSet.offset = { x: 0, y: 0 }
        stateWouldBeSet.offset[dir] = (offset[dir] || 0) + 1
        this.setState(stateWouldBeSet, () => {
          this.setState({ offset }, cb)
        })
      } else {
        stateWouldBeSet.offset = offset
        this.setState(stateWouldBeSet, cb)
      }
    } else {
      this.setState(stateWouldBeSet, cb)
    }
  }

  /**
   * Scroll by index
   */
  scrollBy = (step: number, animated: boolean = true) => {
    const { loop } = this.props
    const { dir, width, height, index, total } = this.state
    if (this.internals.isScrolling || total < 2) return

    const diff = (loop ? 1 : 0) + step + index
    let x = 0
    let y = 0
    if (dir === 'x') x = diff * width
    if (dir === 'y') y = diff * height

    const node = this.$scrollView.current
    node && (node as ScrollView).scrollTo({ x, y, animated })

    // update scroll state
    this.internals.isScrolling = true

    this.setState({ autoplayEnd: false })
  }

  scrollViewPropOverrides = () => {
    const overrides: any = {}

    // const scrollResponders = [
    //   'onMomentumScrollBegin',
    //   'onTouchStartCapture',
    //   'onTouchStart',
    //   'onTouchEnd',
    //   'onResponderRelease',
    // ]

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
        contentOffset={this.state.offset}
        onScrollBeginDrag={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEndDrag}
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
              <View style={pageStyleLoading} key={i}>
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
