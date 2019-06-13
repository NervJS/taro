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
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ViewPagerAndroid,
  Platform,
  ActivityIndicator,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewPagerAndroidOnPageSelectedEventData
} from 'react-native'
import { ReactNativeSwiperProps, ReactNativeSwiperState } from './PropsType'
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
    onIndexChanged: () => null
  }

  static getDerivedStateFromProps (props: ReactNativeSwiperProps, state: ReactNativeSwiperState) {
    // return state.snapScrollTop !== props.scrollTop || state.snapScrollLeft !== props.scrollLeft ? {
    //   snapScrollTop: props.scrollTop,
    //   snapScrollLeft: props.scrollLeft
    // } : null
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

    initState.dir = !props.horizontal ? 'y' : 'x'

    if (props.width) {
      initState.width = props.width
    } else if (state.width){
      initState.width = state.width
    } else {
      initState.width = width
    }

    if (props.height) {
      initState.height = props.height
    } else if (state.height){
      initState.height = state.height
    } else {
      initState.height = height;
    }

    initState.offset[initState.dir] = (initState.dir === 'y' ? height : width) * (props.index as number)

    // this.internals = {
    //   ...this.internals,
    //   isScrolling: false
    // }

    return initState
  }

  state: ReactNativeSwiperState = {
    width: 0,
    height: 0,
    offset: { x: 0, y: 0 },
    total: 0,
    pIndex: 0,
    index: 0,
    dir: 'y'
  }

  /**
   * Initial render flag
   */
  initialRender: boolean = true

  /**
   * autoplay timer
   */
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

  $scrollView: any = React.createRef<ScrollView|ViewPagerAndroid>()

  getSnapshotBeforeUpdate (prevProps: ReactNativeSwiperProps, prevState: ReactNativeSwiperState) {
    return {
      shouldClearAutoPlay: !this.props.autoplay && this.autoplayTimer,
      ifIndexChange: prevProps.index !== this.props.index
    }
  }

  componentDidUpdate (prevProps: ReactNativeSwiperProps, prevState: ReactNativeSwiperState, snapshot: { shouldClearAutoPlay: boolean; ifIndexChange: boolean; }) {
    if (snapshot.shouldClearAutoPlay) {
      clearTimeout(this.autoplayTimer as number)
    }
    // If the index has changed, we notify the parent via the onIndexChanged callback
    if (snapshot.ifIndexChange) {
      const { index, onIndexChanged } = this.props
      onIndexChanged && onIndexChanged(index as number)
    }
  }

  componentDidMount () {
    this.autoplay()
  }

  componentWillUnmount () {
    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.loopJumpTimer && clearTimeout(this.loopJumpTimer)
  }

  // include internals with state
  fullState () {
    return Object.assign({}, this.state, this.internals)
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    const offset: Partial<{ x: number; y: number; }> = this.internals.offset = {}
    const state: any = { width, height }

    if (this.state.total > 1) {
      let setup = this.state.index
      if (this.props.loop) {
        setup++
      }
      offset[this.state.dir] = this.state.dir === 'y'
        ? height * setup
        : width * setup
    }

    // only update the offset in state if needed, updating offset while swiping
    // causes some bad jumping / stuttering
    if (!this.state.offset || width !== this.state.width || height !== this.state.height) {
      state.offset = offset
    }

    // related to https://github.com/leecade/react-native-swiper/issues/570
    // contentOffset is not working in react 0.48.x so we need to use scrollTo
    // to emulate offset.
    if (Platform.OS === 'ios') {
      if (this.initialRender && this.state.total > 1) {
        const node = this.$scrollView.current
        node && (node as ScrollView).scrollTo({...offset, animated: false})
        this.initialRender = false;
      }
    }

    this.setState(state)
  }

  loopJump = () => {
    if (!this.state.loopJump) return
    const i = this.state.index + (this.props.loop ? 1 : 0)
    const node = this.$scrollView.current
    if (node) {
      this.loopJumpTimer = setTimeout(() => (node as ViewPagerAndroid).setPageWithoutAnimation && (node as ViewPagerAndroid).setPageWithoutAnimation(i), 50)
    }
  }

  /**
   * Automatic rolling
   */
  autoplay = () => {
    if (!Array.isArray(this.props.children) ||
      !this.props.autoplay ||
      this.internals.isScrolling ||
      this.state.autoplayEnd) return

    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.autoplayTimer = setTimeout(() => {
      if (!this.props.loop && (
          this.props.autoplayDirection
            ? this.state.index === this.state.total - 1
            : this.state.index === 0
        )
      ) return this.setState({ autoplayEnd: true })

      this.scrollBy(this.props.autoplayDirection ? 1 : -1)
    }, (this.props.autoplayTimeout as number) * 1000)
  }

  /**
   * Scroll begin handle
   * @param  {object} e native event
   */
  onScrollBegin = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      onScrollBeginDrag
    } = this.props
    // update scroll state
    this.internals.isScrolling = true
    onScrollBeginDrag && onScrollBeginDrag(e, this.fullState(), this)
  }

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
  onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>|Partial<NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>>) => {
    const {
      onMomentumScrollEnd
    } = this.props

    // update scroll state
    this.internals.isScrolling = false

    let contentOffset
    // making our events coming from android compatible to updateIndex logic
    if (!(e as NativeSyntheticEvent<NativeScrollEvent>).nativeEvent.contentOffset) {
      if (this.state.dir === 'x') {
        contentOffset = { x: (e as NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>).nativeEvent.position * this.state.width }
      } else {
        contentOffset = { y: (e as NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>).nativeEvent.position * this.state.height }
      }
    } else {
      contentOffset = (e as NativeSyntheticEvent<NativeScrollEvent>).nativeEvent.contentOffset
    }

    this.updateIndex(contentOffset, this.state.dir, () => {
      this.autoplay()
      this.loopJump()

      // if `onMomentumScrollEnd` registered will be called here
      onMomentumScrollEnd && onMomentumScrollEnd(e, this.fullState(), this)
    })
  }

  /*
   * Drag end handle
   * @param {object} e native event
   */
  onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent
    const { horizontal, children } = this.props
    const { index } = this.state
    const { offset } = this.internals
    const previousOffset = horizontal ? offset.x : offset.y
    const newOffset = horizontal ? contentOffset.x : contentOffset.y

    if (previousOffset === newOffset &&
      (index === 0 || index === children.length - 1)) {
      this.internals.isScrolling = false
    }
  }

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
  updateIndex = (offset: { x?: number; y?: number }, dir: 'x'|'y', cb: any) => {
    const state = this.state
    let index: number = state.index
    if (!this.internals.offset)   // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
      this.internals.offset = {}
    const diff = (offset[dir] || 0) - (this.internals.offset[dir] || 0)
    const step = dir === 'x' ? state.width : state.height
    let loopJump = false

    // Do nothing if offset no change.
    if (!diff) return

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    // parseInt() ensures it's always an integer
    index = parseInt(index + Math.round(diff / step) + '')

    if (this.props.loop) {
      if (index <= -1) {
        index = state.total - 1
        offset[dir] = step * state.total
        loopJump = true
      } else if (index >= state.total) {
        index = 0
        offset[dir] = step
        loopJump = true
      }
    }

    const newState: any = {}
    newState.index = index
    newState.loopJump = loopJump

    this.internals.offset = offset

    // only update offset in state if loopJump is true
    if (loopJump) {
      // when swiping to the beginning of a looping set for the third time,
      // the new offset will be the same as the last one set in state.
      // Setting the offset to the same thing will not do anything,
      // so we increment it by 1 then immediately set it to what it should be,
      // after render.
      if (offset[dir] === this.internals.offset[dir]) {
        newState.offset = { x: 0, y: 0 }
        newState.offset[dir] = (offset[dir] || 0)+ 1
        this.setState(newState, () => {
          this.setState({ offset: offset }, cb)
        })
      } else {
        newState.offset = offset
        this.setState(newState, cb)
      }
    } else {
      this.setState(newState, cb)
    }
  }

  /**
   * Scroll by index
   * @param  {number} index offset index
   * @param  {bool} animated
   */

  scrollBy = (index: number, animated: boolean = true) => {
    if (this.internals.isScrolling || this.state.total < 2) return
    const state = this.state
    const diff = (this.props.loop ? 1 : 0) + index + this.state.index
    let x = 0
    let y = 0
    if (state.dir === 'x') x = diff * state.width
    if (state.dir === 'y') y = diff * state.height

    const node = this.$scrollView.current
    if (Platform.OS !== 'ios') {
      node && (node as ViewPagerAndroid)[animated ? 'setPage' : 'setPageWithoutAnimation'](diff)
    } else {
      node && (node as ScrollView).scrollTo({ x, y, animated })
    }

    // update scroll state
    this.internals.isScrolling = true
    this.setState({
      autoplayEnd: false
    })

    // trigger onScrollEnd manually in android
    if (!animated || Platform.OS !== 'ios') {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff
          }
        })
      })
    }
  }

  scrollViewPropOverrides = () => {
    const props = this.props
    let overrides: any = {}

    /*
    const scrollResponders = [
      'onMomentumScrollBegin',
      'onTouchStartCapture',
      'onTouchStart',
      'onTouchEnd',
      'onResponderRelease',
    ]
    */

    for (let prop in props) {
      // if(~scrollResponders.indexOf(prop)
      if (typeof props[prop as keyof ReactNativeSwiperProps] === 'function' &&
        prop !== 'onMomentumScrollEnd' &&
        prop !== 'renderPagination' &&
        prop !== 'onScrollBeginDrag'
      ) {
        let originResponder = props[prop as keyof ReactNativeSwiperProps]
        overrides[prop] = (e: any) => originResponder(e, this.fullState(), this)
      }
    }

    return overrides
  }

  /**
   * Render pagination
   * @return {object} react-dom
   */
  renderPagination = () => {
     // By default, dots only show when `total` >= 2
    if (this.state.total <= 1) return null

    let dots = []
    const ActiveDot = this.props.activeDot || <View style={[{
      backgroundColor: this.props.activeDotColor || '#007aff',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3
    }, this.props.activeDotStyle]} />
    const Dot = this.props.dot || <View style={[{
      backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3
    }, this.props.dotStyle ]} />
    for (let i = 0; i < this.state.total; i++) {
      dots.push(i === this.state.index
        ? React.cloneElement(ActiveDot, {key: i})
        : React.cloneElement(Dot, {key: i})
      )
    }

    return (
      <View pointerEvents='none' style={[styles[this.state.dir === 'x' ? `pagination_x` : `pagination_y`], this.props.paginationStyle]}>
        {dots}
      </View>
    )
  }

  renderTitle = () => {
    const child: any = this.props.children[this.state.index]
    const title = child && child.props && child.props.title
    return title
      ? (<View style={styles.title}>
        {(this.props.children[this.state.index] as any).props.title}
      </View>)
      : null
  }

  renderNextButton = () => {
    let button: any = null

    if (this.props.loop ||
      this.state.index !== this.state.total - 1) {
      button = this.props.nextButton || <Text style={styles.buttonText}>›</Text>
    }

    return (
      <TouchableOpacity
        onPress={() => button !== null && this.scrollBy(1)}
        disabled={this.props.disableNextButton}
      >
        <View>
          {button}
        </View>
      </TouchableOpacity>
    )
  }

  renderPrevButton = () => {
    let button: any = null

    if (this.props.loop || this.state.index !== 0) {
      button = this.props.prevButton || <Text style={styles.buttonText}>‹</Text>
    }

    return (
      <TouchableOpacity onPress={() => button !== null && this.scrollBy(-1)}>
        <View>
          {button}
        </View>
      </TouchableOpacity>
    )
  }

  renderButtons = () => {
    return (
      <View pointerEvents='box-none' style={[styles.buttonWrapper, {
        width: this.state.width,
        height: this.state.height
      }, this.props.buttonWrapperStyle]}>
        {this.renderPrevButton()}
        {this.renderNextButton()}
      </View>
    )
  }

  onPageScrollStateChanged = (state: 'Idle' | 'Dragging' | 'Settling') => {
    switch (state) {
      case 'Dragging':
        return this.onScrollBegin()
      case 'Idle':
      case 'Settling':
        this.props.onTouchEnd && this.props.onTouchEnd()
    }
  }

  renderScrollView = (pages: any) => {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          ref={this.$scrollView}
          {...this.props}
          {...this.scrollViewPropOverrides()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.wrapperIOS, this.props.style]}
          contentOffset={this.state.offset}
          onScrollBeginDrag={this.onScrollBegin}
          onMomentumScrollEnd={this.onScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          style={this.props.scrollViewStyle}>
          {pages}
        </ScrollView>
       )
    }
    return (
      <ViewPagerAndroid
        ref={this.$scrollView}
        {...this.props}
        initialPage={this.props.loop ? this.state.index + 1 : this.state.index}
        onPageScrollStateChanged={this.onPageScrollStateChanged}
        onPageSelected={this.onScrollEnd}
        key={pages.length}
        style={[styles.wrapperAndroid, this.props.style]}>
        {pages}
      </ViewPagerAndroid>
    )
  }

  /**
   * Default render
   * @return {object} react-dom
   */
  render () {
    const state = this.state
    const props = this.props
    const {
      index,
      total,
      width,
      height
    } = this.state;
    const {
      children,
      containerStyle,
      loop,
      loadMinimal,
      loadMinimalSize,
      loadMinimalLoader,
      renderPagination,
      showsButtons,
      showsPagination,
    } = this.props;
    // let dir = state.dir
    // let key = 0
    const loopVal = loop ? 1 : 0
    let pages: Element[] | Element = []

    const pageStyle = [{width: width, height: height}, styles.slide]
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

      pages = pagesKeys.map((page: string, i: number) => {
        if (loadMinimal) {
          if (i >= (index + loopVal - (loadMinimalSize as number)) &&
            i <= (index + loopVal + (loadMinimalSize as number))) {
            return <View style={pageStyle} key={i}>{children[parseInt(page)]}</View>
          } else {
            return (
              <View style={pageStyleLoading} key={i}>
                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
              </View>
            )
          }
        } else {
          return <View style={pageStyle} key={i}>{children[parseInt(page)]}</View>
        }
      })
    } else {
      pages = <View style={pageStyle} key={0}>{children}</View>
    }

    return (
      <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
        {this.renderScrollView(pages)}
        {showsPagination && (renderPagination
          ? renderPagination(index, total, this)
          : this.renderPagination())}
        {this.renderTitle()}
        {showsButtons && this.renderButtons()}
      </View>
    )
  }
}
