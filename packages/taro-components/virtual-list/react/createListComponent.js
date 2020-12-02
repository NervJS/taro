/* eslint-disable no-sequences */
/* eslint-disable no-case-declarations */
/* eslint-disable no-void */
/* eslint-disable no-return-assign */
import { memoizeOne } from '../memoize'
import { createElement, PureComponent } from 'react'
import { cancelTimeout, requestTimeout } from '../timer'
import { getRTLOffsetType } from '../domHelpers'
const IS_SCROLLING_DEBOUNCE_INTERVAL = 150

const defaultItemKey = (index) => index // In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.

let devWarningsDirection = null
let devWarningsTagName = null

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined' && typeof window.WeakSet !== 'undefined') {
    devWarningsDirection =
      /* #__PURE__ */
      new WeakSet()
    devWarningsTagName =
      /* #__PURE__ */
      new WeakSet()
  }
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
        instance: this,
        isScrolling: false,
        scrollDirection: 'forward',
        scrollOffset: typeof this.props.initialScrollOffset === 'number' ? this.props.initialScrollOffset : 0,
        scrollUpdateWasRequested: false
      }
      this._callOnItemsRendered = void 0
      this._callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
        overscanStartIndex,
        overscanStopIndex,
        visibleStartIndex,
        visibleStopIndex
      }))
      this._callOnScroll = void 0
      this._callOnScroll = memoizeOne((scrollDirection, scrollOffset, scrollUpdateWasRequested) => this.props.onScroll({
        scrollDirection,
        scrollOffset,
        scrollUpdateWasRequested
      }))
      this._getItemStyle = void 0

      this._getStyleValue = value => {
        return typeof value === 'number'
          ? value + 'px'
          : value == null
            ? ''
            : value
      }

      this._getItemStyle = index => {
        const {
          direction,
          itemSize,
          layout
        } = this.props

        const itemStyleCache = this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize, shouldResetStyleCacheOnItemSizeChange && layout, shouldResetStyleCacheOnItemSizeChange && direction)

        let style

        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index]
        } else {
          const offset = getItemOffset(this.props, index, this._instanceProps)
          const size = getItemSize(this.props, index, this._instanceProps) // TODO Deprecate direction "horizontal"

          const isHorizontal = direction === 'horizontal' || layout === 'horizontal'
          const isRtl = direction === 'rtl'
          const offsetHorizontal = isHorizontal ? offset : 0
          itemStyleCache[index] = style = {
            position: 'absolute',
            left: isRtl ? undefined : offsetHorizontal,
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
          scrollLeft,
          scrollWidth
        } = event.currentTarget
        this.setState(prevState => {
          if (prevState.scrollOffset === scrollLeft) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null
          }

          const {
            direction
          } = this.props
          let scrollOffset = scrollLeft

          if (direction === 'rtl') {
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
          scrollTop
        } = event.currentTarget
        this.setState(prevState => {
          if (prevState.scrollOffset === scrollTop) {
            // Scroll position may have been updated by cDM/cDU,
            // In which case we don't need to trigger another render,
            // And we don't want to update state.isScrolling.
            return null
          } // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.

          const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
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
      validateSharedProps(nextProps, prevState)
      validateProps(nextProps)
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
      this.scrollTo(getOffsetForIndexAndAlignment(this.props, index, align, scrollOffset, this._instanceProps))
    }

    componentDidMount () {
      const {
        direction,
        initialScrollOffset,
        layout
      } = this.props

      if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
        const outerRef = this._outerRef // TODO Deprecate direction "horizontal"

        if (direction === 'horizontal' || layout === 'horizontal') {
          outerRef.scrollLeft = initialScrollOffset
        } else {
          outerRef.scrollTop = initialScrollOffset
        }
      }

      this._callPropsCallbacks()
    }

    componentDidUpdate () {
      const {
        direction,
        layout
      } = this.props
      const {
        scrollOffset,
        scrollUpdateWasRequested
      } = this.state

      if (scrollUpdateWasRequested && this._outerRef != null) {
        const outerRef = this._outerRef // TODO Deprecate direction "horizontal"

        if (direction === 'horizontal' || layout === 'horizontal') {
          if (direction === 'rtl') {
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

      this._callPropsCallbacks()
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
        itemCount,
        itemData,
        itemKey = defaultItemKey,
        layout,
        outerElementType,
        outerTagName,
        style,
        useIsScrolling,
        width,
        ...rest
      } = this.props
      const {
        isScrolling,
        scrollOffset,
        scrollUpdateWasRequested
      } = this.state // TODO Deprecate direction "horizontal"

      const isHorizontal = direction === 'horizontal' || layout === 'horizontal'
      const onScroll = isHorizontal ? this._onScrollHorizontal : this._onScrollVertical

      const [startIndex, stopIndex] = this._getRangeToRender()

      const items = []

      if (itemCount > 0) {
        for (let index = startIndex; index <= stopIndex; index++) {
          items.push(createElement(children, {
            data: itemData,
            key: itemKey(index, itemData),
            index,
            isScrolling: useIsScrolling ? isScrolling : undefined,
            style: this._getItemStyle(index)
          }))
        }
      } // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.

      const estimatedTotalSize = getEstimatedTotalSize(this.props, this._instanceProps)
      const outerElementProps = {
        ...rest,
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
      return createElement(outerElementType || outerTagName || 'div', outerElementProps, createElement(innerElementType || innerTagName || 'div', {
        children: items,
        ref: innerRef,
        style: {
          height: this._getStyleValue(isHorizontal ? '100%' : estimatedTotalSize),
          pointerEvents: isScrolling ? 'none' : 'auto',
          width: this._getStyleValue(isHorizontal ? estimatedTotalSize : '100%')
        }
      }))
    }

    _callPropsCallbacks () {
      if (typeof this.props.onItemsRendered === 'function') {
        const {
          itemCount
        } = this.props

        if (itemCount > 0) {
          const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex] = this._getRangeToRender()

          this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex)
        }
      }

      if (typeof this.props.onScroll === 'function') {
        const {
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested
        } = this.state

        this._callOnScroll(scrollDirection, scrollOffset, scrollUpdateWasRequested)
      }
    } // Lazily create and cache item styles while scrolling,
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

      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this._instanceProps)
      const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this._instanceProps) // Overscan by one item in each direction so that tab/focus works.
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
} // NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.

const validateSharedProps = ({
  children,
  direction,
  height,
  layout,
  innerTagName,
  outerTagName,
  width
}, {
  instance
}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (innerTagName != null || outerTagName != null) {
      if (devWarningsTagName && !devWarningsTagName.has(instance)) {
        devWarningsTagName.add(instance)
        console.warn('The innerTagName and outerTagName props have been deprecated. ' + 'Please use the innerElementType and outerElementType props instead.')
      }
    } // TODO Deprecate direction "horizontal"

    const isHorizontal = direction === 'horizontal' || layout === 'horizontal'

    switch (direction) {
      case 'horizontal':
      case 'vertical':
        if (devWarningsDirection && !devWarningsDirection.has(instance)) {
          devWarningsDirection.add(instance)
          console.warn('The direction prop should be either "ltr" (default) or "rtl". ' + 'Please use the layout prop to specify "vertical" (default) or "horizontal" orientation.')
        }

        break

      case 'ltr':
      case 'rtl':
        // Valid values
        break

      default:
        throw Error('An invalid "direction" prop has been specified. ' + 'Value should be either "ltr" or "rtl". ' + `"${direction}" was specified.`)
    }

    switch (layout) {
      case 'horizontal':
      case 'vertical':
        // Valid values
        break

      default:
        throw Error('An invalid "layout" prop has been specified. ' + 'Value should be either "horizontal" or "vertical". ' + `"${layout}" was specified.`)
    }

    if (children == null) {
      throw Error('An invalid "children" prop has been specified. ' + 'Value should be a React component. ' + `"${children === null ? 'null' : typeof children}" was specified.`)
    }

    if (isHorizontal && typeof width !== 'number') {
      throw Error('An invalid "width" prop has been specified. ' + 'Horizontal lists must specify a number for width. ' + `"${width === null ? 'null' : typeof width}" was specified.`)
    } else if (!isHorizontal && typeof height !== 'number') {
      throw Error('An invalid "height" prop has been specified. ' + 'Vertical lists must specify a number for height. ' + `"${height === null ? 'null' : typeof height}" was specified.`)
    }
  }
}
