import memoizeOne from 'memoize-one'
import { nextTick } from 'vue'

import { IS_WEB } from '../../../utils/constants'
import { convertNumber2PX } from '../../../utils/convert'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import ListSet from '../list-set'
import Preset from '../preset'
import { defaultItemKey, isHorizontalFunc } from '../utils'
import render from './render'

const getItemOffset = ({
  itemSize
}, index) => index * itemSize
const getItemSize = ({
  itemSize
}) => itemSize
const getEstimatedTotalSize = ({
  itemCount,
  itemSize
}) => itemSize * itemCount
const getOffsetForIndexAndAlignment = (props, index, align, scrollOffset) => {
  const isHorizontal = isHorizontalFunc(props)
  const { height, itemCount, itemSize, width } = props
  const size = isHorizontal ? width : height
  const lastItemOffset = Math.max(0, itemCount * itemSize - size)
  const maxOffset = Math.min(lastItemOffset, index * itemSize)
  const minOffset = Math.max(0, index * itemSize - size + itemSize)

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
const getStartIndexForOffset = ({
  itemCount,
  itemSize
}, offset) => {
  return Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)))
}
const getStopIndexForStartIndex = (props, startIndex, scrollOffset) => {
  const isHorizontal = isHorizontalFunc(props)
  const { height, itemCount, itemSize, width } = props
  const offset = startIndex * itemSize
  const size = isHorizontal ? width : height
  const numVisibleItems = Math.ceil((size + scrollOffset - offset) / itemSize)
  return Math.max(0, Math.min(itemCount - 1, startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
  ))
}

export default {
  props: {
    height: {
      type: String || Number,
      required: true
    },
    width: {
      type: String || Number,
      required: true
    },
    itemCount: {
      type: Number,
      required: true
    },
    itemData: {
      type: Array,
      required: true
    },
    itemSize: {
      type: Number || Function,
      required: true
    },
    unlimitedSize: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'absolute'
    },
    initialScrollOffset: {
      type: Number,
      default: 0
    },
    innerElementType: {
      type: String,
      default: IS_WEB ? 'taro-view-core' : 'view'
    },
    // renderTop
    // renderBottom
    direction: {
      type: String,
      default: 'ltr'
    },
    layout: {
      type: String,
      default: 'vertical'
    },
    overscanCount: {
      type: Number,
      default: 1
    },
    placeholderCount: {
      type: Number
    },
    useIsScrolling: {
      type: Boolean,
      default: false
    },
    item: {
      required: true
    },
    itemKey: String,
    itemTagName: String,
    innerTagName: String,
    outerTagName: String,
    itemElementType: String,
    outerElementType: String,
    innerRef: String,
    outerRef: String,
    onItemsRendered: Function,
    onScrollNative: Function,
    shouldResetStyleCacheOnItemSizeChange: {
      type: Boolean,
      default: true
    },
    wclass: String,
    wstyle: String,
  },
  data () {
    return {
      itemList: new ListSet(this.$props),
      preset: new Preset(this.$props),
      instance: this,
      isScrolling: false,
      scrollDirection: 'forward',
      scrollOffset:
        typeof this.$props.initialScrollOffset === 'number'
          ? this.$props.initialScrollOffset
          : 0,
      scrollUpdateWasRequested: false,
      resetIsScrollingTimeoutId: null
    }
  },
  methods: {
    scrollTo (scrollOffset) {
      scrollOffset = Math.max(0, scrollOffset)

      if (this.scrollOffset === scrollOffset) {
        return
      }

      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = true

      nextTick(this._resetIsScrollingDebounced)
    },

    scrollToItem (index, align = 'auto') {
      const { itemCount } = this.$props
      const { scrollOffset } = this.$data

      index = Math.max(0, Math.min(index, itemCount - 1))

      this.scrollTo(
        getOffsetForIndexAndAlignment(
          this.$props,
          index,
          align,
          scrollOffset
        )
      )
    },

    _callOnItemsRendered: memoizeOne(
      function (
        overscanStartIndex,
        overscanStopIndex,
        visibleStartIndex,
        visibleStopIndex
      ) {
        return this.$props.onItemsRendered({
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex
        })
      }
    ),

    _callOnScroll: memoizeOne(
      function (
        scrollDirection,
        scrollOffset,
        scrollUpdateWasRequested
      ) {
        this.$emit('scroll', {
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested
        })
      }
    ),

    _callPropsCallbacks () {
      if (typeof this.$props.onItemsRendered === 'function') {
        const { itemCount } = this.$props
        if (itemCount > 0) {
          const [
            overscanStartIndex,
            overscanStopIndex,
            visibleStartIndex,
            visibleStopIndex
          ] = this._getRangeToRender()
          this._callOnItemsRendered(
            overscanStartIndex,
            overscanStopIndex,
            visibleStartIndex,
            visibleStopIndex
          )
        }
      }

      this._callOnScroll(
        this.scrollDirection,
        this.scrollOffset,
        this.scrollUpdateWasRequested
      )
    },

    _getItemStyle (index) {
      const { direction, itemSize, layout, shouldResetStyleCacheOnItemSizeChange } = this.$props

      const itemStyleCache = this.preset.getItemStyleCache(
        shouldResetStyleCacheOnItemSizeChange ? itemSize : false,
        shouldResetStyleCacheOnItemSizeChange ? layout : false,
        shouldResetStyleCacheOnItemSizeChange ? direction : false
      )

      let style
      if (itemStyleCache.hasOwnProperty(index)) {
        style = itemStyleCache[index]
      } else {
        const offset = getItemOffset(this.$props, index)
        const size = getItemSize(this.$props)

        const isHorizontal = this.preset.isHorizontal

        const isRtl = this.preset.isRtl
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
          style[k] = convertNumber2PX(style[k])
        }
      }

      return style
    },

    _getRangeToRender () {
      const { itemCount, overscanCount } = this.$props
      const { isScrolling, scrollDirection, scrollOffset } = this.$data

      if (itemCount === 0) {
        return [0, 0, 0, 0]
      }

      const startIndex = getStartIndexForOffset(
        this.$props,
        scrollOffset
      )
      const stopIndex = getStopIndexForStartIndex(
        this.$props,
        startIndex,
        scrollOffset
      )

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      const overscanBackward =
        !isScrolling || scrollDirection === 'backward'
          ? Math.max(1, overscanCount)
          : 1
      const overscanForward =
        !isScrolling || scrollDirection === 'forward'
          ? Math.max(1, overscanCount)
          : 1

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex
      ]
    },

    _onScrollHorizontal (event) {
      const clientWidth = this.$props.width
      const { scrollLeft, scrollWidth } = event.currentTarget
      if (this.$props.onScrollNative) {
        this.$props.onScrollNative(event)
      }
      if (this.scrollOffset === scrollLeft) {
        return
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
      }

      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      scrollOffset = Math.max(
        0,
        Math.min(scrollOffset, scrollWidth - clientWidth)
      )
      this.isScrolling = true
      this.scrollDirection = this.scrollOffset < scrollLeft ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = false
      nextTick(this._resetIsScrollingDebounced)
    },

    _onScrollVertical (event) {
      const clientHeight = this.$props.height
      const { scrollHeight, scrollTop } = event.currentTarget
      if (this.$props.onScrollNative) {
        this.$props.onScrollNative(event)
      }
      if (this.scrollOffset === scrollTop) {
        return
      }

      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const scrollOffset = Math.max(
        0,
        Math.min(scrollTop, scrollHeight - clientHeight)
      )

      this.isScrolling = true
      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = false
      nextTick(this._resetIsScrollingDebounced)
    },

    _outerRefSetter (ref) {
      const {
        outerRef
      } = this.$props
      this._outerRef = ref

      if (typeof outerRef === 'function') {
        outerRef(ref)
      } else if (outerRef != null && typeof outerRef === 'object' && outerRef.hasOwnProperty('value')) {
        outerRef.value = ref
      }
    },

    _resetIsScrollingDebounced () {
      if (this.resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this.resetIsScrollingTimeoutId)
      }

      this.resetIsScrollingTimeoutId = requestTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      )
    },

    _resetIsScrolling () {
      this.resetIsScrollingTimeoutId = null
      this.isScrolling = false
      nextTick(() => {
        this.preset.getItemStyleCache(-1, null)
      })
    }
  },
  mounted () {
    const { initialScrollOffset } = this.$props

    if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
      const outerRef = this._outerRef
      if (this.preset.isHorizontal) {
        outerRef.scrollLeft = initialScrollOffset
      } else {
        outerRef.scrollTop = initialScrollOffset
      }
    }

    this._callPropsCallbacks()
  },
  updated () {
    this.itemList.update(this.$props)
    this.preset.update(this.$props)

    const { scrollOffset, scrollUpdateWasRequested } = this.$data

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
            default: {
              const { clientWidth, scrollWidth } = outerRef
              outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset
              break
            }
          }
        } else {
          outerRef.scrollLeft = scrollOffset
        }
      } else {
        outerRef.scrollTop = scrollOffset
      }
    }

    this._callPropsCallbacks()
  },

  beforeDestroy () {
    if (this.resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this.resetIsScrollingTimeoutId)
    }
  },

  render () {
    const {
      item,
      wclass,
      direction,
      height,
      innerRef,
      innerElementType,
      itemCount,
      itemData,
      itemKey = defaultItemKey,
      layout,
      wstyle,
      useIsScrolling,
      width
    } = this.$props
    const { isScrolling } = this.$data

    const isHorizontal = this.preset.isHorizontal

    const onScroll = isHorizontal
      ? this._onScrollHorizontal
      : this._onScrollVertical

    const [startIndex, stopIndex] = this._getRangeToRender()

    const items = []
    if (itemCount > 0) {
      for (let index = startIndex; index <= stopIndex; index++) {

        items.push(
          render(item, {
            key: itemKey(index, itemData),
            props: {
              data: itemData,
              index,
              isScrolling: useIsScrolling ? isScrolling : undefined,
              css: this._getItemStyle(index)
            }
          })
        )
      }
    }

    // Read this value AFTER items have been created,
    // So their actual sizes (if variable) are taken into consideration.
    const estimatedTotalSize = getEstimatedTotalSize(
      this.$props
    )

    const scrollViewName = IS_WEB ? 'taro-scroll-view-core' : 'scroll-view'
    return render(
      scrollViewName,
      {
        class: wclass,
        ref: this._outerRefSetter,
        style: {
          position: 'relative',
          height: convertNumber2PX(height),
          width: convertNumber2PX(width),
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          direction,
          ...wstyle
        },
        attrs: {
          scrollY: layout === 'vertical',
          scrollX: layout === 'horizontal'
        },
        on: {
          scroll: onScroll
        }
      },
      [
        render(
          innerElementType,
          {
            ref: innerRef,
            style: {
              height: convertNumber2PX(isHorizontal ? '100%' : estimatedTotalSize),
              pointerEvents: isScrolling ? 'none' : undefined,
              width: convertNumber2PX(isHorizontal ? estimatedTotalSize : '100%')
            }
          },
          items
        )
      ]
    )
  }
}
