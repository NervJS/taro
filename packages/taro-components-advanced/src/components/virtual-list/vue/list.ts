import memoizeOne from 'memoize-one'
import { nextTick, renderSlot } from 'vue'

import { IS_VUE3,IS_WEB } from '../../../utils/constants'
import { convertNumber2PX } from '../../../utils/convert'
import { omit } from '../../../utils/lodash'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import Preset from '../preset'
import { defaultItemKey, getRectSize } from '../utils'
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
    itemTagName: {
      type: String,
      default: IS_WEB ? 'taro-view-core' : 'view'
    },
    innerTagName: {
      type: String,
      default: IS_WEB ? 'taro-view-core' : 'view'
    },
    outerTagName: {
      type: String,
      default: IS_WEB ? 'taro-scroll-view-core' : 'scroll-view'
    },
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
  },
  data () {
    const preset = new Preset(this.$props, this.refresh)
    return {
      itemList: preset.itemList,
      preset,
      id: this.$props.id || preset.id,
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
    refresh () {
      this.$forceUpdate()
    },
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

      setTimeout(() => {
        const [startIndex, stopIndex] = this._getRangeToRender()
        const isHorizontal = this.preset.isHorizontal
        for (let index = startIndex; index <= stopIndex; index++) {
          this._getSizeUploadSync(index, isHorizontal)
        }
      }, 0)
    },

    _getSizeUploadSync (index: number, isHorizontal: boolean) {
      const ID = `#${this.$data.id}-${index}`
  
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
      direction,
      height,
      innerRef,
      itemCount,
      itemData,
      itemKey = defaultItemKey,
      layout,
      useIsScrolling,
      width
    } = omit(this.$props, ['innerElementType', 'innerTagName', 'itemElementType', 'itemTagName', 'outerElementType', 'outerTagName', 'position'])
    const {
      id,
      isScrolling,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.$data

    const isHorizontal = this.preset.isHorizontal
    const placeholderCount = this.preset.placeholderCount
    const onScroll = isHorizontal
      ? this._onScrollHorizontal
      : this._onScrollVertical

    const [startIndex, stopIndex] = this._getRangeToRender()

    const items = []
    if (itemCount > 0) {
      const prevPlaceholder = startIndex < placeholderCount ? startIndex : placeholderCount
      items.push(new Array(prevPlaceholder).fill(-1).map((_, index) => render(
        this.preset.itemTagName, {
          key: itemKey(index + startIndex - prevPlaceholder, itemData),
          style: { display: 'none' }
        }
      )))
      for (let index = startIndex; index <= stopIndex; index++) {
        const style = this.preset.getItemStyle(index)
        items.push(
          render(this.preset.itemTagName, {
            key: itemKey(index, itemData),
            style
          }, [
            render(item, {
              id: `${id}-${index}`,
              props: {
                id: `${id}-${index}`,
                data: itemData,
                index,
                isScrolling: useIsScrolling ? isScrolling : undefined
              }
            })
          ])
        )
      }
      const restCount = itemCount - stopIndex
      const postPlaceholder = restCount < placeholderCount ? restCount : placeholderCount
      items.push(new Array(postPlaceholder).fill(-1).map((_, index) => render(
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
      id,
      ref: this._outerRefSetter,
      layout,
      style: {
        position: 'relative',
        height: convertNumber2PX(height),
        width: convertNumber2PX(width),
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform',
        direction
      },
      attrs: {
        scrollY: layout === 'vertical',
        scrollX: layout === 'horizontal'
      },
      on: {
        scroll: onScroll
      }
    }
    if (isHorizontal) {
      outerElementProps.scrollLeft = scrollUpdateWasRequested ? scrollOffset : this.field.scrollLeft
    } else {
      outerElementProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.field.scrollTop
    }

    if (this.preset.isRelative) {
      const pre = convertNumber2PX(this.itemList.getOffsetSize(startIndex))
      return render(this.preset.outerTagName, outerElementProps, [
        IS_VUE3 ? renderSlot(this.$slots, 'top') : this.$slots.top,
        render(this.preset.itemTagName, {
          key: `${id}-pre`,
          id: `${id}-pre`,
          style: {
            height: isHorizontal ? '100%' : pre,
            width: !isHorizontal ? '100%' : pre
          }
        }),
        render(this.preset.innerTagName, {
          ref: innerRef,
          key: `${id}-inner`,
          id: `${id}-inner`,
          style: {
            pointerEvents: isScrolling ? 'none' : 'auto',
            position: 'relative',
          }
        }, items),
        IS_VUE3 ? renderSlot(this.$slots, 'bottom') : this.$slots.bottom,
      ])
    } else {
      return render(this.preset.outerTagName, outerElementProps, [
        IS_VUE3 ? renderSlot(this.$slots, 'top') : this.$slots.top,
        render(this.preset.innerTagName, {
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
        IS_VUE3 ? renderSlot(this.$slots, 'bottom') : this.$slots.bottom,
      ])
    }
  }
}
