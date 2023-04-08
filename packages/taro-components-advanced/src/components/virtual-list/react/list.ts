import memoizeOne from 'memoize-one'
import React from 'react'

import { convertNumber2PX } from '../../../utils/convert'
import { omit } from '../../../utils/lodash'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import ListSet from '../list-set'
import Preset from '../preset'
import { defaultItemKey, getRectSize, getScrollViewContextNode } from '../utils'
import { validateListProps } from './validate'

import type { IProps } from '../preset'

export interface IState {
  id: string
  instance: List
  isScrolling: boolean
  scrollDirection: 'forward' | 'backward'
  scrollOffset: number
  scrollUpdateWasRequested: boolean
  refreshCount: number
}

export default class List extends React.PureComponent<IProps, IState> {
  static defaultProps: IProps = {
    direction: 'ltr',
    itemData: undefined,
    layout: 'vertical',
    overscanCount: 2,
    useIsScrolling: false,
    shouldResetStyleCacheOnItemSizeChange: true
  }

  static getDerivedStateFromProps (nextProps: IProps, prevState: IState) {
    return validateListProps(nextProps, prevState)
  }

  itemList: ListSet
  preset: Preset

  constructor (props: IProps) {
    super(props)

    this.preset = new Preset(
      props,
      this.refresh
    )
    this.itemList = this.preset.itemList

    this.state = {
      id: this.props.id || this.preset.id,
      instance: this,
      isScrolling: false,
      scrollDirection: 'forward',
      scrollOffset:
        typeof this.props.initialScrollOffset === 'number'
          ? this.props.initialScrollOffset
          : 0,
      scrollUpdateWasRequested: false,
      refreshCount: 0
    }
  }

  refresh = () => {
    if (process.env.FRAMEWORK === 'preact') {
      this.forceUpdate()
    } else {
      this.setState(({ refreshCount }) => ({
        refreshCount: ++refreshCount
      }))
    }
  }

  _outerRef = undefined

  _resetIsScrollingTimeoutId = null

  _callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }))

  _callOnScroll = memoizeOne((scrollDirection, scrollOffset, scrollUpdateWasRequested, detail) => this.props.onScroll({
    scrollDirection,
    scrollOffset,
    scrollUpdateWasRequested,
    detail
  } as any))

  _callPropsCallbacks (prevProps: any = {}, prevState: any = {}) {
    if (typeof this.props.onItemsRendered === 'function') {
      if (this.props.itemCount > 0) {
        if (prevProps && prevProps.itemCount !== this.props.itemCount) {
          const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex] = this._getRangeToRender()

          this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex)
        }
      }
    }

    if (typeof this.props.onScroll === 'function') {
      if (!prevState ||
        prevState.scrollDirection !== this.state.scrollDirection ||
        prevState.scrollOffset !== this.state.scrollOffset ||
        prevState.scrollUpdateWasRequested !== this.state.scrollUpdateWasRequested
      ) {
        this._callOnScroll(
          this.state.scrollDirection,
          this.state.scrollOffset,
          this.state.scrollUpdateWasRequested,
          this.preset.field
        )
      }
    }

    setTimeout(() => {
      const [startIndex, stopIndex] = this._getRangeToRender()
      const isHorizontal = this.preset.isHorizontal
      for (let index = startIndex; index <= stopIndex; index++) {
        this._getSizeUploadSync(index, isHorizontal)
      }
    }, 0)
  }

  _getSizeUploadSync = (index: number, isHorizontal: boolean) => {
    const ID = `#${this.state.id}-${index}`

    return new Promise((resolve) => {
      const success = ({ width, height }) => {
        const size = isHorizontal ? width : height
        if (!this.itemList.compareSize(index, size)) {
          this.itemList.setSize(index, size)
          resolve(this.itemList.getSize(index))
        }
      }
      const fail = () => {
        const [startIndex, stopIndex] = this._getRangeToRender()
        if (index >= startIndex && index <= stopIndex) {
          setTimeout(() => {
            getRectSize(ID, success, fail)
          }, 100)
        }
      }
      getRectSize(ID, success, fail)
    })
  }

  // Lazily create and cache item styles while scrolling,
  // So that pure component sCU will prevent re-renders.
  // We maintain this cache, and pass a style prop rather than index,
  // So that List can clear cached styles and force item re-render if necessary.
  _getRangeToRender () {
    return this.itemList.getRangeToRender(
      this.state.scrollDirection,
      this.state.scrollOffset,
      this.state.isScrolling
    )
  }

  _onScrollHorizontal = event => {
    const {
      clientWidth = this.itemList.wrapperSize,
      scrollHeight,
      scrollWidth = this.itemList.getOffsetSize(),
      scrollTop,
      scrollLeft,
    } = event.currentTarget
    this.preset.field = {
      scrollHeight: scrollHeight,
      scrollWidth: this.itemList.getOffsetSize(),
      scrollTop: scrollTop,
      scrollLeft: scrollLeft,
      clientHeight: scrollHeight,
      clientWidth: scrollWidth
    }
    this.setState((prevState: any) => {
      const diffOffset = this.preset.field.scrollLeft - scrollLeft
      if (prevState.scrollOffset === scrollLeft || this.preset.isShaking(diffOffset)) {
        // Scroll position may have been updated by cDM/cDU,
        // In which case we don't need to trigger another render,
        // And we don't want to update state.isScrolling.
        return null
      }

      let scrollOffset = scrollLeft

      if (this.preset.isRtl) {
        // TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
        // This is not the case for all browsers though (e.g. Chrome reports values as positive, measured relative to the left).
        // It's also easier for this component if we convert offsets to the same format as they would be in for ltr.
        // So the simplest solution is to determine which browser behavior we're dealing with, and convert based on it.
        switch (getRTLOffsetType()) {
          case 'negative':
            scrollOffset = -scrollLeft
            break

          case 'positive-descending':
            scrollOffset = scrollWidth - clientWidth - scrollLeft
            break
        }
      } // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.

      this.preset.field = {
        scrollWidth: scrollOffset,
      }
      return {
        isScrolling: true,
        scrollDirection: prevState.scrollOffset < scrollLeft ? 'forward' : 'backward',
        scrollOffset,
        scrollUpdateWasRequested: false
      }
    }, this._resetIsScrollingDebounced)
  }

  _onScrollVertical = event => {
    const {
      clientHeight = this.itemList.wrapperSize,
      scrollHeight = this.itemList.getOffsetSize(),
      scrollWidth,
      scrollTop,
      scrollLeft
    } = event.currentTarget
    this.setState((prevState: IState) => {
      const diffOffset = this.preset.field.scrollTop - scrollTop
      if (prevState.scrollOffset === scrollTop || this.preset.isShaking(diffOffset)) {
        // Scroll position may have been updated by cDM/cDU,
        // In which case we don't need to trigger another render,
        // And we don't want to update state.isScrolling.
        return null
      }
      // FIXME preact 中使用时，该组件会出现触底滚动事件重复触发导致的抖动问题，后续修复
      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
      this.preset.field = {
        scrollHeight: this.itemList.getOffsetSize(),
        scrollWidth: scrollWidth,
        scrollTop: scrollOffset,
        scrollLeft: scrollLeft,
        clientHeight: clientHeight,
        clientWidth: scrollWidth,
        diffOffset: this.preset.field.scrollTop - scrollOffset,
      }
      return {
        isScrolling: true,
        scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
        scrollOffset,
        scrollUpdateWasRequested: false
      }
    }, this._resetIsScrollingDebounced)
  }

  _outerRefSetter = ref => {
    const {
      outerRef
    } = this.props
    this._outerRef = ref

    if (typeof outerRef === 'function') {
      outerRef(ref)
    } else if (outerRef != null && typeof outerRef === 'object' && outerRef.hasOwnProperty('current')) {
      // @ts-ignore
      outerRef.current = ref
    }
  }

  _resetIsScrollingDebounced = () => {
    if (this._resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this._resetIsScrollingTimeoutId)
    }

    this._resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL)
  }

  _resetIsScrolling = () => {
    this._resetIsScrollingTimeoutId = null
    this.setState({
      isScrolling: false
    }, () => {
      // Clear style cache after state update has been committed.
      // This way we don't break pure sCU for items that don't use isScrolling param.
      this.preset.getItemStyleCache(-1, null)
    })
  }

  public scrollTo (scrollOffset = 0) {
    const { enhanced } = this.props
    scrollOffset = Math.max(0, scrollOffset)
    if (this.state.scrollOffset === scrollOffset) return

    if (enhanced) {
      const isHorizontal = this.preset.isHorizontal
      const option: any = {
        animated: true,
        duration: 500
      }
      if (isHorizontal) {
        option.left	= scrollOffset
      } else {
        option.top = scrollOffset
      }
      return getScrollViewContextNode(`#${this.state.id}`).then((node: any) => node.scrollTo(option))
    }

    this.setState((prevState: IState) => {
      if (prevState.scrollOffset === scrollOffset) {
        return null
      }

      return {
        scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
        scrollOffset: scrollOffset,
        scrollUpdateWasRequested: true
      }
    }, this._resetIsScrollingDebounced)
  }

  public scrollToItem (index: number, align = 'auto') {
    const { itemCount } = this.props
    const { scrollOffset } = this.state
    index = Math.max(0, Math.min(index, itemCount - 1))
    this.scrollTo(this.itemList.getOffsetForIndexAndAlignment(index, align, scrollOffset))
  }

  componentDidMount () {
    const { initialScrollOffset } = this.props

    if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
      const outerRef = this._outerRef

      if (this.preset.isHorizontal) {
        outerRef.scrollLeft = initialScrollOffset
      } else {
        outerRef.scrollTop = initialScrollOffset
      }
    }

    this._callPropsCallbacks()
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    const { scrollOffset, scrollUpdateWasRequested } = this.state

    this.preset.update(this.props)

    if (scrollUpdateWasRequested && this._outerRef != null) {
      const outerRef = this._outerRef

      if (this.preset.isHorizontal) {
        if (this.preset.isRtl) {
          // TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
          // This is not the case for all browsers though (e.g. Chrome reports values as positive, measured relative to the left).
          // So we need to determine which browser behavior we're dealing with, and mimic it.
          switch (getRTLOffsetType()) {
            case 'negative':
              outerRef.scrollLeft = -scrollOffset
              break

            case 'positive-ascending':
              outerRef.scrollLeft = scrollOffset
              break

            default:
              outerRef.scrollLeft = outerRef.scrollWidth - outerRef.clientWidth - scrollOffset
              break
          }
        } else {
          outerRef.scrollLeft = scrollOffset
        }
      } else {
        outerRef.scrollTop = scrollOffset
      }
    }

    this._callPropsCallbacks(prevProps, prevState)
  }

  componentWillUnmount () {
    if (this._resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this._resetIsScrollingTimeoutId)
    }
  }

  render () {
    const {
      className,
      direction,
      height,
      innerRef,
      item,
      itemCount,
      itemData,
      itemKey = defaultItemKey,
      layout,
      style,
      useIsScrolling,
      width,
      enhanced = false,
      renderTop,
      renderBottom,
      ...rest
    } = omit(this.props, ['innerElementType', 'innerTagName', 'itemElementType', 'itemTagName', 'outerElementType', 'outerTagName', 'position'])
    const {
      id,
      isScrolling,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.state

    const isHorizontal = this.preset.isHorizontal
    const placeholderCount = this.preset.placeholderCount
    const onScroll = isHorizontal
      ? this._onScrollHorizontal
      : this._onScrollVertical

    const [startIndex, stopIndex] = this._getRangeToRender()

    const items = []

    if (itemCount > 0) {
      const prevPlaceholder = startIndex < placeholderCount ? startIndex : placeholderCount
      items.push(new Array(prevPlaceholder).fill(-1).map((_, index) => React.createElement<any>(
        this.preset.itemTagName, {
          key: itemKey(index + startIndex - prevPlaceholder, itemData),
          style: { display: 'none' }
        }
      )))
      for (let index = startIndex; index <= stopIndex; index++) {
        const style = this.preset.getItemStyle(index)
        items.push(React.createElement<any>(this.preset.itemTagName, {
          key: itemKey(index, itemData),
          style
        }, React.createElement(item, {
          id: `${id}-${index}`,
          data: itemData,
          index,
          isScrolling: useIsScrolling ? isScrolling : undefined
        })))
      }
      let restCount = itemCount - stopIndex
      restCount =  restCount > 0 ? restCount : 0
      const postPlaceholder = restCount < placeholderCount ? restCount : placeholderCount
      items.push(new Array(postPlaceholder).fill(-1).map((_, index) => React.createElement<any>(
        this.preset.itemTagName, {
          key: itemKey(1 + index + stopIndex, itemData),
          style: { display: 'none' }
        }
      )))
    }

    // Read this value AFTER items have been created,
    // So their actual sizes (if variable) are taken into consideration.
    const estimatedTotalSize = convertNumber2PX(this.itemList.getOffsetSize())
    const outerElementProps: any = {
      ...rest,
      id,
      className,
      onScroll,
      ref: this._outerRefSetter,
      layout,
      enhanced,
      style: {
        position: 'relative',
        height: convertNumber2PX(height),
        width: convertNumber2PX(width),
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform',
        direction,
        ...style
      }
    }

    if (!enhanced) {
      if (isHorizontal) {
        outerElementProps.scrollLeft = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollLeft
      } else {
        outerElementProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollTop
      }
    }

    if (this.preset.isRelative) {
      const pre = convertNumber2PX(this.itemList.getOffsetSize(startIndex))
      return React.createElement(this.preset.outerTagName, outerElementProps,
        renderTop,
        React.createElement<any>(this.preset.itemTagName, {
          key: `${id}-pre`,
          id: `${id}-pre`,
          style: {
            height: isHorizontal ? '100%' : pre,
            width: !isHorizontal ? '100%' : pre
          }
        }),
        React.createElement<any>(this.preset.innerTagName, {
          ref: innerRef,
          key: `${id}-inner`,
          id: `${id}-inner`,
          style: {
            pointerEvents: isScrolling ? 'none' : 'auto',
            position: 'relative',
          }
        }, items),
        renderBottom
      )
    } else {
      return React.createElement(this.preset.outerTagName, outerElementProps,
        renderTop,
        React.createElement<any>(this.preset.innerTagName, {
          ref: innerRef,
          key: `${id}-inner`,
          id: `${id}-inner`,
          style: {
            height: isHorizontal ? '100%' : estimatedTotalSize,
            pointerEvents: isScrolling ? 'none' : 'auto',
            position: 'relative',
            width: !isHorizontal ? '100%' : estimatedTotalSize
          }
        }, items),
        renderBottom
      )
    }
  }
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.
