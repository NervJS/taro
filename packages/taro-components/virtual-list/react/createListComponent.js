/* eslint-disable no-sequences */
/* eslint-disable no-case-declarations */
/* eslint-disable no-void */
/* eslint-disable no-return-assign */
import { createSelectorQuery } from '@tarojs/taro'
import { getRTLOffsetType } from '../domHelpers'
import { memoizeOne } from '../memoize'
import { createElement, PureComponent } from 'react'
import { cancelTimeout, requestTimeout } from '../timer'

const IS_SCROLLING_DEBOUNCE_INTERVAL = 200

const defaultItemKey = (index) => index // In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.

let INSTANCE_ID = 0

export function isHorizontalFunc ({ direction, layout }) {
  return direction === 'horizontal' || layout === 'horizontal'
}
export function isRtlFunc ({ direction }) {
  return direction === 'rtl'
}
export function getRectSize (id, success = () => {}, fail = () => {}) {
  const query = createSelectorQuery()
  query.select(id).boundingClientRect((res) => {
    if (res) {
      success(res)
    } else {
      fail()
    }
  }).exec()
}

export default function createListComponent ({
  getItemOffset,
  getEstimatedTotalSize,
  getItemSize,
  getOffsetForIndexAndAlignment,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
  shouldResetStyleCacheOnItemSizeChange,
  validateProps
}) {
  let _class, _temp

  return _temp = _class = class List extends PureComponent {
    // Always use explicit constructor for React components.
    // It produces less code after transpilation. (#26)
    // eslint-disable-next-line no-useless-constructor
    constructor (props) {
      super(props)
      this._instanceProps = initInstanceProps(this.props, this)
      this._outerRef = void 0
      this._resetIsScrollingTimeoutId = null
      this.state = {
        id: this.props.id || `virtual-list-${INSTANCE_ID++}`,
        instance: this,
        isScrolling: false,
        scrollDirection: 'forward',
        scrollOffset: typeof this.props.initialScrollOffset === 'number' ? this.props.initialScrollOffset : 0,
        scrollUpdateWasRequested: false,
        sizeList: []
      }
      if (this.props.unlimitedSize) {
        this.state.sizeList = new Array(this.props.itemCount).fill(-1)
      }
      this.field = {
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        scrollWidth: 0,
        clientHeight: 0,
        clientWidth: 0
      }
      this._callOnItemsRendered = void 0
      this._callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
        overscanStartIndex,
        overscanStopIndex,
        visibleStartIndex,
        visibleStopIndex
      }))
      this._callOnScroll = void 0
      this._callOnScroll = memoizeOne((scrollDirection, scrollOffset, scrollUpdateWasRequested, detail) => this.props.onScroll({
        scrollDirection,
        scrollOffset,
        scrollUpdateWasRequested,
        detail
      }))

      this._getSize = void 0

      this._getSize = (size) => {
        if (typeof size === 'number' && size >= 0) {
          return size
        }
        return this.props.itemSize
      }

      this._getSizeUploadSync = void 0

      this._getSizeUploadSync = (index, isHorizontal) => {
        const ID = `#${this.state.id}-${index}`

        return new Promise((resolve) => {
          const success = ({ width, height }) => {
            const { sizeList } = this.state
            const size = isHorizontal ? width : height
            if (size !== sizeList[index]) {
              sizeList[index] = this._getSize(size)
              this.setState({
                sizeList: [...sizeList]
              }, () => {
                resolve(this._getSize(size))
              })
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

      this._getSizeUpload = (index, isHorizontal) => {
        this._getSizeUploadSync(index, isHorizontal)
        const { sizeList } = this.state
        return this._getSize(sizeList[index])
      }

      this._getCountSize = void 0

      this._getCountSize = (props, count) => {
        if (!props.unlimitedSize) {
          return props.itemSize * count
        }
        const { sizeList } = this.state
        const sizes = sizeList.slice(0, count)
        return sizes.reduce((p, a) => {
          return p + this._getSize(a)
        }, 0)
      }

      this._getSizeCount = void 0

      this._getSizeCount = (props, offset) => {
        if (offset === 0) {
          return 0
        }
        if (!props.unlimitedSize) {
          return Math.min(props.itemCount - 1, Math.floor(offset / props.itemSize))
        }
        let offsetSize = 0
        const { sizeList } = this.state
        const count = sizeList.reduce((p, a) => {
          a = this._getSize(a)
          if (offsetSize < offset) {
            offsetSize += a
            return ++p
          }
          return p
        }, 0)
        return count - 1
      }

      this._getStyleValue = value => {
        return typeof value === 'number'
          ? value + 'px'
          : value == null
            ? ''
            : value
      }

      this._getItemStyle = void 0

      this._getItemStyle = index => {
        const {
          direction,
          itemSize,
          layout
        } = this.props

        const itemStyleCache = this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize, shouldResetStyleCacheOnItemSizeChange && layout, shouldResetStyleCacheOnItemSizeChange && direction)

        let style

        const offset = getItemOffset(this.props, index, this)
        const size = getItemSize(this.props, index, this) // TODO Deprecate direction "horizontal"
        const isHorizontal = isHorizontalFunc(this.props)
        const isRtl = isRtlFunc(this.props)
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index]
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
            style[k] = this._getStyleValue(style[k])
          }
        }

        return style
      }

      this._getItemStyleCache = void 0
      this._getItemStyleCache = memoizeOne(() => ({}))

      this._onScrollHorizontal = event => {
        const {
          clientWidth,
          scrollTop,
          scrollLeft,
          scrollHeight,
          scrollWidth
        } = event.currentTarget
        this.field.scrollHeight = scrollHeight
        this.field.scrollWidth = getEstimatedTotalSize(this.props, this)
        this.field.scrollTop = scrollTop
        this.field.scrollLeft = scrollLeft
        this.field.clientHeight = scrollHeight
        this.field.clientWidth = clientWidth
        this.setState(prevState => {
          if (prevState.scrollOffset === scrollLeft) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null
          }

          let scrollOffset = scrollLeft

          if (isRtlFunc(this.props)) {
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

      this._onScrollVertical = event => {
        const {
          clientHeight,
          scrollHeight,
          scrollWidth,
          scrollTop,
          scrollLeft
        } = event.currentTarget
        this.setState(prevState => {
          const diffOffset = this.field.scrollTop - scrollTop
          if (prevState.scrollOffset === scrollTop || this.field.diffOffset === -diffOffset) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null
          } // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
          const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
          this.field.scrollHeight = getEstimatedTotalSize(this.props, this)
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

      this._outerRefSetter = ref => {
        const {
          outerRef
        } = this.props
        this._outerRef = ref

        if (typeof outerRef === 'function') {
          outerRef(ref)
        } else if (outerRef != null && typeof outerRef === 'object' && outerRef.hasOwnProperty('current')) {
          outerRef.current = ref
        }
      }

      this._resetIsScrollingDebounced = () => {
        if (this._resetIsScrollingTimeoutId !== null) {
          cancelTimeout(this._resetIsScrollingTimeoutId)
        }

        this._resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL)
      }

      this._resetIsScrolling = () => {
        this._resetIsScrollingTimeoutId = null
        this.setState({
          isScrolling: false
        }, () => {
          // Clear style cache after state update has been committed.
          // This way we don't break pure sCU for items that don't use isScrolling param.
          this._getItemStyleCache(-1, null)
        })
      }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      validateProps(nextProps, prevState)
      return null
    }

    scrollTo (scrollOffset) {
      scrollOffset = Math.max(0, scrollOffset)
      this.setState(prevState => {
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

    scrollToItem (index, align = 'auto') {
      const {
        itemCount
      } = this.props
      const {
        scrollOffset
      } = this.state
      index = Math.max(0, Math.min(index, itemCount - 1))
      this.scrollTo(getOffsetForIndexAndAlignment(this.props, this.state.id, index, align, scrollOffset, this))
    }

    componentDidMount () {
      const { initialScrollOffset } = this.props

      if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
        const outerRef = this._outerRef // TODO Deprecate direction "horizontal"

        if (isHorizontalFunc(this.props)) {
          outerRef.scrollLeft = initialScrollOffset
        } else {
          outerRef.scrollTop = initialScrollOffset
        }
      }

      this._callPropsCallbacks()
    }

    componentDidUpdate (prevProps, prevState) {
      const {
        scrollOffset,
        scrollUpdateWasRequested
      } = this.state

      if (scrollUpdateWasRequested && this._outerRef != null) {
        const outerRef = this._outerRef // TODO Deprecate direction "horizontal"

        if (isHorizontalFunc(this.props)) {
          if (isRtlFunc(this.props)) {
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
                const {
                  clientWidth,
                  scrollWidth
                } = outerRef
                outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset
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
        const isHorizontal = isHorizontalFunc(this.props)
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
      } = this.state // TODO Deprecate direction "horizontal"

      const isHorizontal = isHorizontalFunc(this.props)
      const onScroll = isHorizontal ? this._onScrollHorizontal : this._onScrollVertical

      const [startIndex, stopIndex] = this._getRangeToRender()

      const items = []

      if (itemCount > 0) {
        for (let index = startIndex; index <= stopIndex; index++) {
          const key = itemKey(index, itemData)
          let style
          if (position === 'relative') {
            const size = getItemSize(this.props, index, this)
            style = {
              height: this._getStyleValue(!isHorizontal ? size : '100%'),
              width: this._getStyleValue(isHorizontal ? size : '100%')
            }
          } else {
            style = this._getItemStyle(index)
          }
          items.push(createElement(itemElementType || itemTagName || 'div', {
            key, style
          }, createElement(children, {
            id: `${id}-${index}`,
            data: itemData,
            index,
            isScrolling: useIsScrolling ? isScrolling : undefined
          })))
        }
      }
      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.

      const estimatedTotalSize = getEstimatedTotalSize(this.props, this)
      const outerElementProps = {
        ...rest,
        id,
        className,
        onScroll,
        ref: this._outerRefSetter,
        layout,
        style: {
          position: 'relative',
          height: this._getStyleValue(height),
          width: this._getStyleValue(width),
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
        const pre = getItemOffset(this.props, startIndex, this)
        return createElement(outerElementType || outerTagName || 'div', outerElementProps,
          renderTop,
          createElement(itemElementType || itemTagName || 'div', {
            key: `${id}-pre`,
            id: `${id}-pre`,
            style: {
              height: isHorizontal ? '100%' : this._getStyleValue(pre),
              width: !isHorizontal ? '100%' : this._getStyleValue(pre)
            }
          }),
          createElement(innerElementType || innerTagName || 'div', {
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
        return createElement(outerElementType || outerTagName || 'div', outerElementProps,
          renderTop,
          createElement(innerElementType || innerTagName || 'div', {
            ref: innerRef,
            key: `${id}-inner`,
            id: `${id}-inner`,
            style: {
              height: this._getStyleValue(isHorizontal ? '100%' : estimatedTotalSize),
              pointerEvents: isScrolling ? 'none' : 'auto',
              width: this._getStyleValue(isHorizontal ? estimatedTotalSize : '100%')
            }
          }, items),
          renderBottom
        )
      }
    }

    _callPropsCallbacks (prevProps, prevState) {
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
      const {
        itemCount,
        overscanCount
      } = this.props
      const {
        isScrolling,
        scrollDirection,
        scrollOffset
      } = this.state

      if (itemCount === 0) {
        return [0, 0, 0, 0]
      }

      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this)
      const stopIndex = getStopIndexForStartIndex(this.props, scrollOffset, startIndex, this) // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.

      const overscanBackward = !isScrolling || scrollDirection === 'backward' ? Math.max(1, overscanCount) : 1
      const overscanForward = !isScrolling || scrollDirection === 'forward' ? Math.max(1, overscanCount) : 1
      return [Math.max(0, startIndex - overscanBackward), Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)), startIndex, stopIndex]
    }
  }, _class.defaultProps = {
    direction: 'ltr',
    itemData: undefined,
    layout: 'vertical',
    overscanCount: 2,
    useIsScrolling: false
  }, _temp
}

// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.
