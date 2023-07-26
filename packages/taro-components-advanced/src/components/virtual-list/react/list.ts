import memoizeOne from 'memoize-one'
import React from 'react'

import { cancelTimeout, convertNumber2PX, defaultItemKey, getRectSizeSync, getScrollViewContextNode, omit, requestTimeout } from '../../../utils'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import ListSet from '../list-set'
import Preset from '../preset'
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
      this.refresh,
    )
    this.itemList = this.preset.itemList
    const id = this.props.id || this.preset.id
    this.preset.updateWrapper(id)

    this.state = {
      id,
      instance: this,
      isScrolling: false,
      scrollDirection: 'forward',
      scrollOffset:
        typeof this.props.initialScrollOffset === 'number'
          ? this.props.initialScrollOffset
          : 0,
      scrollUpdateWasRequested: false,
      refreshCount: 0,
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

  _callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, startIndex, stopIndex) => this.props.onItemsRendered({
    overscanStartIndex,
    overscanStopIndex,
    startIndex,
    stopIndex
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
          const [overscanStartIndex, overscanStopIndex, startIndex, stopIndex] = this._getRangeToRender()

          this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, startIndex, stopIndex)
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
    return new Promise((resolve) => {
      if (index >= 0 && index < this.props.itemCount) {
        const times = this.itemList.compareSize(index) ? 3 : 0
        getRectSizeSync(`#${this.state.id}-${index}`, 100, times).then(({ width, height }) => {
          const size = isHorizontal ? width : height
          if (typeof size === 'number' && size > 0 && !this.itemList.compareSize(index, size)) {
            this.itemList.setSize(index, size)
            resolve(this.itemList.getSize(index))
          }
        })
      }
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
      scrollHeight,
      scrollWidth = this.itemList.getOffsetSizeCache(),
      scrollTop,
      scrollLeft,
    } = event.currentTarget
    const clientWidth = this.itemList.wrapperSize
    this.preset.field = {
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft,
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
      scrollHeight = this.itemList.getOffsetSizeCache(),
      scrollWidth,
      scrollTop,
      scrollLeft
    } = event.currentTarget
    const clientHeight = this.itemList.wrapperSize
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
        scrollHeight,
        scrollWidth,
        scrollTop: scrollOffset,
        scrollLeft,
        clientHeight,
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
      this.preset.resetCache()
    })
  }

  public scrollTo (scrollOffset = 0, enhanced = this.preset.enhanced) {
    scrollOffset = Math.max(0, scrollOffset)
    if (this.state.scrollOffset === scrollOffset) return

    if (enhanced) {
      const isHorizontal = this.preset.isHorizontal
      const option: any = {
        animated: true,
        duration: 300,
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
        scrollOffset,
        scrollUpdateWasRequested: true
      }
    }, this._resetIsScrollingDebounced)
  }

  public scrollToItem (index: number, align = 'auto', enhanced = this.preset.enhanced) {
    const { itemCount } = this.props
    const { scrollOffset } = this.state
    index = Math.max(0, Math.min(index, itemCount - 1))
    this.scrollTo(this.itemList.getOffsetForIndexAndAlignment(index, align, scrollOffset), enhanced)
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

  getRenderItemNode (index: number, type: 'node' | 'placeholder' = 'node') {
    const { item, itemData, itemKey = defaultItemKey, useIsScrolling } = this.props
    const { id, isScrolling } = this.state
    const key = itemKey(index, itemData)

    const style = this.preset.getItemStyle(index)
    if (type === 'placeholder') {
      return React.createElement<any>(this.preset.itemElement, {
        key,
        id: `${id}-${index}-wrapper`,
        style: this.preset.isBrick ? style : { display: 'none' }
      })
    }

    return React.createElement<any>(this.preset.itemElement, {
      key: itemKey(index, itemData),
      id: `${id}-${index}-wrapper`,
      style
    }, React.createElement(item, {
      id: `${id}-${index}`,
      data: itemData,
      index,
      isScrolling: useIsScrolling ? isScrolling : undefined
    }))
  }

  getRenderColumnNode () {
    const { id, isScrolling } = this.state
    const { innerRef, itemCount } = this.props
    const isHorizontal = this.preset.isHorizontal
    // Read this value AFTER items have been created,
    // So their actual sizes (if variable) are taken into consideration.
    const estimatedTotalSize = convertNumber2PX(this.itemList.getOffsetSize())
    const columnProps: any = {
      ref: innerRef,
      key: `${id}-inner`,
      id: `${id}-inner`,
      style: {
        height: isHorizontal ? '100%' : estimatedTotalSize,
        width: !isHorizontal ? '100%' : estimatedTotalSize,
        position: 'relative',
        pointerEvents: isScrolling ? 'none' : 'auto',
      }
    }

    const [startIndex, stopIndex] = this._getRangeToRender()
    const items = []

    if (this.preset.isRelative && !this.preset.isBrick) {
      const pre = convertNumber2PX(this.itemList.getOffsetSizeCache(startIndex))
      items.push(
        React.createElement<any>(this.preset.itemElement, {
          key: `${id}-pre`,
          id: `${id}-pre`,
          style: {
            height: isHorizontal ? '100%' : pre,
            width: !isHorizontal ? '100%' : pre
          }
        })
      )
    }

    const placeholderCount = this.preset.placeholderCount
    const restCount = itemCount - stopIndex
    const prevPlaceholder = startIndex < placeholderCount ? startIndex : placeholderCount
    const postPlaceholder = restCount < placeholderCount ? restCount : placeholderCount

    for (let itemIndex = 0; itemIndex < stopIndex + postPlaceholder; itemIndex++) {
      if (!this.preset.isBrick) {
        if (itemIndex < startIndex - prevPlaceholder) {
          itemIndex = startIndex - prevPlaceholder
          continue
        }
      }

      if (itemIndex < startIndex || itemIndex > stopIndex) {
        items.push(this.getRenderItemNode(itemIndex, 'placeholder'))
      } else {
        items.push(this.getRenderItemNode(itemIndex))
      }
    }
    return React.createElement<any>(this.preset.innerElement, columnProps, items)
  }

  render () {
    const {
      className,
      direction,
      height,
      layout,
      style,
      width,
      enhanced = false,
      outerWrapper,
      renderTop,
      renderBottom,
      ...rest
    } = omit(this.props, [
      'item', 'itemCount', 'itemData', 'itemKey', 'useIsScrolling',
      'innerElementType', 'innerTagName', 'itemElementType', 'itemTagName',
      'outerElementType', 'outerTagName',
      'position', 'innerRef',
    ])
    const {
      id,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.state

    const isHorizontal = this.preset.isHorizontal

    const outerProps: any = {
      ...rest,
      id,
      className,
      onScroll: isHorizontal ? this._onScrollHorizontal : this._onScrollVertical,
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
      },
      outerElementType: this.preset.outerElement,
      innerElementType: this.preset.innerElement,
      renderTop,
      renderBottom,
    }

    if (!enhanced) {
      if (isHorizontal) {
        outerProps.scrollLeft = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollLeft
      } else {
        outerProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollTop
      }
    }

    return React.createElement(
      outerWrapper || this.preset.outerElement,
      outerProps,
      this.getRenderColumnNode(),
    )
  }
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.
