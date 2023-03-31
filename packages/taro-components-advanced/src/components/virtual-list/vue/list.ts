import { isWebPlatform } from '@tarojs/shared'
import memoizeOne from 'memoize-one'

import { convertNumber2PX } from '../../../utils/convert'
import { omit } from '../../../utils/lodash'
import { cancelTimeout, requestTimeout } from '../../../utils/timer'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import Preset from '../preset'
import { defaultItemKey, getRectSize, getScrollViewContextNode } from '../utils'
import render from './render'

const isWeb = isWebPlatform()

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
      default: isWeb ? 'taro-view-core' : 'view'
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
      default: isWeb ? 'taro-view-core' : 'view'
    },
    innerTagName: {
      type: String,
      default: isWeb ? 'taro-view-core' : 'view'
    },
    outerTagName: {
      type: String,
      default: isWeb ? 'taro-scroll-view-core' : 'scroll-view'
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
      resetIsScrollingTimeoutId: null,
      refreshCount: 0
    }
  },
  methods: {
    refresh () {
      this.refreshCount = this.refreshCount + 1
    },
    scrollTo (scrollOffset) {
      const { enhanced } = this.$props
      scrollOffset = Math.max(0, scrollOffset)
      if (this.scrollOffset === scrollOffset) return

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
        return getScrollViewContextNode(`#${this.$data.id}`).then((node: any) => node.scrollTo(option))
      }

      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = true

      this.$nextTick(this._resetIsScrollingDebounced)
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
        scrollUpdateWasRequested,
        detail
      ) {
        this.$emit('scroll', {
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested,
          detail
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
        this.scrollUpdateWasRequested,
        this.preset.field
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
      if (this.$props.onScrollNative) {
        this.$props.onScrollNative(event)
      }
      const diffOffset = this.preset.field.scrollLeft - scrollLeft
      if (this.scrollOffset === scrollLeft || this.preset.isShaking(diffOffset)) {
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
      this.preset.field = {
        scrollWidth: scrollOffset,
      }
      this.isScrolling = true
      this.scrollDirection = this.scrollOffset < scrollLeft ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = false
      this.$nextTick(this._resetIsScrollingDebounced)
    },

    _onScrollVertical (event) {
      const {
        clientHeight = this.itemList.wrapperSize,
        scrollHeight = this.itemList.getOffsetSize(),
        scrollWidth,
        scrollTop,
        scrollLeft,
      } = event.currentTarget
      if (this.$props.onScrollNative) {
        this.$props.onScrollNative(event)
      }
      const diffOffset = this.preset.field.scrollTop - scrollTop
      if (this.scrollOffset === scrollTop || this.preset.isShaking(diffOffset)) {
        return
      }

      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const scrollOffset = Math.max(
        0,
        Math.min(scrollTop, scrollHeight - clientHeight)
      )
      this.preset.field = {
        scrollHeight: this.itemList.getOffsetSize(),
        scrollWidth: scrollWidth,
        scrollTop: scrollOffset,
        scrollLeft: scrollLeft,
        clientHeight: clientHeight,
        clientWidth: scrollWidth,
        diffOffset: this.preset.field.scrollTop - scrollOffset,
      }

      this.isScrolling = true
      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = false
      this.$nextTick(this._resetIsScrollingDebounced)
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
      this.$nextTick(() => {
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
      width,
      enhanced = false
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
      let restCount = itemCount - stopIndex
      restCount =  restCount > 0 ? restCount : 0
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
      enhanced,
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

    if (!enhanced) {
      if (isHorizontal) {
        outerElementProps.scrollLeft = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollLeft
      } else {
        outerElementProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollTop
      }
    }

    if (this.preset.isRelative) {
      const pre = convertNumber2PX(this.itemList.getOffsetSize(startIndex))
      return render(this.preset.outerTagName, outerElementProps, [
        process.env.FRAMEWORK === 'vue3' ? this.$slots.top?.() : this.$slots.top,
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
        process.env.FRAMEWORK === 'vue3' ? this.$slots.bottom?.() : this.$slots.bottom,
      ])
    } else {
      return render(this.preset.outerTagName, outerElementProps, [
        process.env.FRAMEWORK === 'vue3' ? this.$slots.top?.() : this.$slots.top,
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
        process.env.FRAMEWORK === 'vue3' ? this.$slots.bottom?.() : this.$slots.bottom,
      ])
    }
  }
}
