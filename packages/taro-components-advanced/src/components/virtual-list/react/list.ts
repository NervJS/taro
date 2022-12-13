import memoizeOne from 'memoize-one'
import React from 'react'

import { convertNumber2PX } from '../../../utils/convert'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import ListSet from '../list-set'
import { defaultItemKey, getRectSize, isHorizontalFunc, isRtlFunc } from '../utils'
import { validateListProps } from './validate'

import type { VirtualListProps } from '../'

let INSTANCE_ID = 0

export interface IProps extends Partial<VirtualListProps> {
  direction?: 'ltr' | 'rtl' | 'horizontal' | 'vertical'
  itemKey?: typeof defaultItemKey
  itemTagName?: string
  innerTagName?: string
  outerTagName?: string
  itemElementType?: React.ComponentType
  outerElementType?: React.ComponentType
  innerRef?: React.Ref<HTMLElement>
  outerRef?: React.Ref<HTMLElement>
  onItemsRendered?: TFunc
  shouldResetStyleCacheOnItemSizeChange?: boolean
}

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

  constructor (props: IProps) {
    super(props)

    this.state = {
      id: this.props.id || `virtual-list-${INSTANCE_ID++}`,
      instance: this,
      isScrolling: false,
      scrollDirection: 'forward',
      scrollOffset: typeof this.props.initialScrollOffset === 'number' ? this.props.initialScrollOffset : 0,
      scrollUpdateWasRequested: false,
      refreshCount: 0
    }
    const setState = this.setState.bind(this)

    this.itemList = new ListSet(
      props,
      () => setState(({ refreshCount }) => ({
        refreshCount: ++refreshCount
      })))
  }

  get isHorizontal () {
    return isHorizontalFunc(this.props)
  }

  get isRtl () {
    return isRtlFunc(this.props)
  }

  get placeholderCount () {
    return this.props.placeholderCount >= 0 ? this.props.placeholderCount : this.props.overscanCount
  }

  getItemSize (props: IProps, index) {
    if (!props.unlimitedSize) {
      return props.itemSize
    }

    this._getSizeUploadSync(index, this.isHorizontal)
    return this.itemList.getSize(index)
  }

  getOffsetForIndexAndAlignment (props, _id, index, align, scrollOffset) {
    const { height, width } = props
    const size = this.isHorizontal ? width : height
    const itemSize = this.itemList.getSize(index)
    const lastItemOffset = Math.max(0, this.itemList.getOffsetSize(props.itemCount) - size)
    const maxOffset = Math.min(lastItemOffset, this.itemList.getOffsetSize(index))
    const minOffset = Math.max(0, this.itemList.getOffsetSize(index) - size + itemSize)

    if (align === 'smart') {
      if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
        align = 'auto'
      } else {
        align = 'center'
      }
    }

    switch (align) {
      case 'start':
        return maxOffset

      case 'end':
        return minOffset

      case 'center':
      {
        // "Centered" offset is usually the average of the min and max.
        // But near the edges of the list, this doesn't hold true.
        const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2)

        if (middleOffset < Math.ceil(size / 2)) {
          return 0 // near the beginning
        } else if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset // near the end
        } else {
          return middleOffset
        }
      }

      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset
        } else if (scrollOffset < minOffset) {
          return minOffset
        } else {
          return maxOffset
        }
    }
  }

  _outerRef = undefined

  _resetIsScrollingTimeoutId = null

  field = {
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    diffOffset: 0
  }

  _callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }))

  // FIXME 优化事件信息
  _callOnScroll = memoizeOne((scrollDirection, scrollOffset, scrollUpdateWasRequested, detail) => this.props.onScroll({
    scrollDirection,
    scrollOffset,
    scrollUpdateWasRequested,
    detail
  } as any))

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

  _getItemStyle = index => {
    const {
      direction,
      itemSize,
      layout,
      shouldResetStyleCacheOnItemSizeChange
    } = this.props

    const itemStyleCache = this._getItemStyleCache(
      shouldResetStyleCacheOnItemSizeChange && itemSize,
      shouldResetStyleCacheOnItemSizeChange && layout,
      shouldResetStyleCacheOnItemSizeChange && direction
    )

    let style

    const offset = this.itemList.getOffsetSize(index)
    const size = this.getItemSize(this.props, index)
    const isHorizontal = this.isHorizontal
    const isRtl = this.isRtl
    if (itemStyleCache.hasOwnProperty(index)) {
      // Note: style is frozen.
      style = { ...itemStyleCache[index] }
      if (isHorizontal) {
        style.width = size
        if (isRtl) {
          style.right = offset
        } else {
          style.left = offset
        }
      } else {
        style.height = size
        style.top = offset
      }
    } else {
      const offsetHorizontal = isHorizontal ? offset : 0
      itemStyleCache[index] = style = {
        position: 'absolute',
        left: !isRtl ? offsetHorizontal : undefined,
        right: isRtl ? offsetHorizontal : undefined,
        top: !isHorizontal ? offset : 0,
        height: !isHorizontal ? size : '100%',
        width: isHorizontal ? size : '100%'
      }
    }

    for (const k in style) {
      if (style.hasOwnProperty(k)) {
        style[k] = convertNumber2PX(style[k])
      }
    }

    return style
  }

  // TODO: Cache of item styles, keyed by item index.
  _getItemStyleCache = memoizeOne((...__args: unknown[]) => ({}))

  _onScrollHorizontal = event => {
    const {
      clientWidth,
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth
    } = event.currentTarget
    this.field.scrollHeight = scrollHeight
    this.field.scrollWidth = this.itemList.getOffsetSize()
    this.field.scrollTop = scrollTop
    this.field.scrollLeft = scrollLeft
    this.field.clientHeight = scrollHeight
    this.field.clientWidth = clientWidth
    this.setState((prevState: any) => {
      if (prevState.scrollOffset === scrollLeft) {
        // Scroll position may have been updated by cDM/cDU,
        // In which case we don't need to trigger another render,
        // And we don't want to update state.isScrolling.
        return null
      }

      let scrollOffset = scrollLeft

      if (this.isRtl) {
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

      scrollOffset = Math.max(0, Math.min(scrollOffset, scrollWidth - clientWidth))
      this.field.scrollWidth = scrollOffset
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
      clientHeight,
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft
    } = event.currentTarget
    this.setState((prevState: any) => {
      const diffOffset = this.field.scrollTop - scrollTop
      if (prevState.scrollOffset === scrollTop || this.field.diffOffset === -diffOffset) {
        // Scroll position may have been updated by cDM/cDU,
        // In which case we don't need to trigger another render,
        // And we don't want to update state.isScrolling.
        return null
      } // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
      this.field.scrollHeight = this.itemList.getOffsetSize()
      this.field.scrollWidth = scrollWidth
      this.field.scrollTop = scrollOffset
      this.field.scrollLeft = scrollLeft
      this.field.clientHeight = clientHeight
      this.field.clientWidth = scrollWidth
      this.field.diffOffset = diffOffset
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
      this._getItemStyleCache(-1, null)
    })
  }

  scrollTo (scrollOffset: number) {
    scrollOffset = Math.max(0, scrollOffset)
    this.setState((prevState: any) => {
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

  scrollToItem (index: number, align = 'auto') {
    const {
      itemCount
    } = this.props
    const {
      scrollOffset
    } = this.state
    index = Math.max(0, Math.min(index, itemCount - 1))
    this.scrollTo(this.getOffsetForIndexAndAlignment(this.props, this.state.id, index, align, scrollOffset))
  }

  componentDidMount () {
    const { initialScrollOffset } = this.props

    if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
      const outerRef = this._outerRef

      if (this.isHorizontal) {
        outerRef.scrollLeft = initialScrollOffset
      } else {
        outerRef.scrollTop = initialScrollOffset
      }
    }

    this._callPropsCallbacks()
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    const {
      scrollOffset,
      scrollUpdateWasRequested
    } = this.state

    this.itemList.update(this.props)

    if (scrollUpdateWasRequested && this._outerRef != null) {
      const outerRef = this._outerRef

      if (this.isHorizontal) {
        if (this.isRtl) {
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

    setTimeout(() => {
      const [startIndex, stopIndex] = this._getRangeToRender()
      const isHorizontal = this.isHorizontal
      for (let index = startIndex; index <= stopIndex; index++) {
        this._getSizeUploadSync(index, isHorizontal)
      }
    }, 0)
  }

  componentWillUnmount () {
    if (this._resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this._resetIsScrollingTimeoutId)
    }
  }

  render () {
    const {
      children,
      className,
      direction,
      height,
      innerRef,
      innerElementType,
      innerTagName,
      itemElementType,
      itemTagName,
      itemCount,
      itemData,
      itemKey = defaultItemKey,
      layout,
      outerElementType,
      outerTagName,
      style,
      useIsScrolling,
      width,
      position,
      renderTop,
      renderBottom,
      ...rest
    } = this.props
    const {
      id,
      isScrolling,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.state

    const isHorizontal = this.isHorizontal
    const placeholderCount = this.placeholderCount
    const onScroll = isHorizontal ? this._onScrollHorizontal : this._onScrollVertical

    const [startIndex, stopIndex] = this._getRangeToRender()

    const items = []

    if (itemCount > 0) {
      const prevPlaceholder = startIndex < placeholderCount ? startIndex : placeholderCount
      items.push(new Array(prevPlaceholder).fill(-1).map((_, index) => React.createElement<any>(
        itemElementType || itemTagName || 'div', {
          key: itemKey(index, itemData),
          style: { display: 'none' }
        }
      )))
      for (let index = startIndex; index <= stopIndex; index++) {
        const key = itemKey(index, itemData)
        let style
        if (position === 'relative') {
          const size = this.getItemSize(this.props, index)
          style = {
            height: convertNumber2PX(!isHorizontal ? size : '100%'),
            width: convertNumber2PX(isHorizontal ? size : '100%')
          }
        } else {
          style = this._getItemStyle(index)
        }
        items.push(React.createElement<any>(itemElementType || itemTagName || 'div', {
          key, style
        }, React.createElement(children, {
          id: `${id}-${index}`,
          data: itemData,
          index,
          isScrolling: useIsScrolling ? isScrolling : undefined
        })))
      }
      const restCount = itemCount - stopIndex
      const postPlaceholder = restCount < placeholderCount ? restCount : placeholderCount
      items.push(new Array(postPlaceholder).fill(-1).map((_, index) => React.createElement<any>(
        itemElementType || itemTagName || 'div', {
          key: itemKey(index + stopIndex, itemData),
          style: { display: 'none' }
        }
      )))
    }
    // Read this value AFTER items have been created,
    // So their actual sizes (if variable) are taken into consideration.

    const estimatedTotalSize = this.itemList.getOffsetSize()
    const outerElementProps: any = {
      ...rest,
      id,
      className,
      onScroll,
      ref: this._outerRefSetter,
      layout,
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
    if (scrollUpdateWasRequested) {
      if (isHorizontal) {
        outerElementProps.scrollLeft = scrollOffset
      } else {
        outerElementProps.scrollTop = scrollOffset
      }
    }

    if (position === 'relative') {
      const pre = this.itemList.getOffsetSize(startIndex)
      return React.createElement(outerElementType || outerTagName || 'div', outerElementProps,
        renderTop,
        React.createElement<any>(itemElementType || itemTagName || 'div', {
          key: `${id}-pre`,
          id: `${id}-pre`,
          style: {
            height: convertNumber2PX(isHorizontal ? '100%' : pre),
            width: convertNumber2PX(!isHorizontal ? '100%' : pre)
          }
        }),
        React.createElement<any>(innerElementType || innerTagName || 'div', {
          ref: innerRef,
          key: `${id}-inner`,
          id: `${id}-inner`,
          style: {
            pointerEvents: isScrolling ? 'none' : 'auto'
          }
        }, items),
        renderBottom
      )
    } else {
      return React.createElement(outerElementType || outerTagName || 'div', outerElementProps,
        renderTop,
        React.createElement<any>(innerElementType || innerTagName || 'div', {
          ref: innerRef,
          key: `${id}-inner`,
          id: `${id}-inner`,
          style: {
            height: convertNumber2PX(isHorizontal ? '100%' : estimatedTotalSize),
            pointerEvents: isScrolling ? 'none' : 'auto',
            width: convertNumber2PX(isHorizontal ? estimatedTotalSize : '100%')
          }
        }, items),
        renderBottom
      )
    }
  }

  _callPropsCallbacks (prevProps: any = {}, prevState: any = {}) {
    if (typeof this.props.onItemsRendered === 'function') {
      if (this.props.itemCount > 0) {
        if (!prevProps && prevProps.itemCount !== this.props.itemCount) {
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
          this.field
        )
      }
    }
  }

  // Lazily create and cache item styles while scrolling,
  // So that pure component sCU will prevent re-renders.
  // We maintain this cache, and pass a style prop rather than index,
  // So that List can clear cached styles and force item re-render if necessary.
  _getRangeToRender () {
    const { width, height } = this.props
    const { isScrolling, scrollDirection, scrollOffset } = this.state
    const size = this.isHorizontal ? width : height
    return this.itemList.getRangeToRender(
      scrollDirection,
      size as number,
      scrollOffset,
      isScrolling
    )
  }
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.
