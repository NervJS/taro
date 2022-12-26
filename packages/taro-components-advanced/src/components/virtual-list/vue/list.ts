import memoizeOne from 'memoize-one'
import { nextTick } from 'vue'

import { IS_WEB } from '../../../utils/constants'
import { convertNumber2PX } from '../../../utils/convert'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import Preset from '../preset'
import { defaultItemKey } from '../utils'
import render from './render'

export default {
  props: {
    height: {
      type: [String, Number],
      required: true
    },
    width: {
      type: [String, Number],
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
      type: [Number, Function],
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
    // TODO renderTop
    // TODO renderBottom
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
    const preset = new Preset(this.$props)
    return {
      itemList: preset.itemList,
      preset,
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
        this.itemList.getOffsetForIndexAndAlignment(
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

    _getRangeToRender () {
      return this.itemList.getRangeToRender(
        this.$data.scrollDirection,
        this.$data.scrollOffset,
        this.$data.isScrolling
      )
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
              css: this.preset.getItemStyle(index)
            }
          })
        )
      }
    }

    // Read this value AFTER items have been created,
    // So their actual sizes (if variable) are taken into consideration.
    const estimatedTotalSize = this.itemList.getOffsetSize()

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
