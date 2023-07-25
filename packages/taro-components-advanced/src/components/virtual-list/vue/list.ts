import { isWebPlatform } from '@tarojs/shared'
import memoizeOne from 'memoize-one'

import { cancelTimeout, convertNumber2PX, defaultItemKey, getRectSize, getScrollViewContextNode, omit, requestTimeout } from '../../../utils'
import render from '../../../utils/vue-render'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import { getRTLOffsetType } from '../dom-helpers'
import Preset from '../preset'

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
    item: {
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
    itemKey: String,
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
    direction: {
      type: String,
      default: 'ltr'
    },
    layout: {
      type: String,
      default: 'vertical'
    },
    initialScrollOffset: {
      type: Number,
      default: 0
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
    enhanced: {
      type: Boolean,
      default: false
    },
    shouldResetStyleCacheOnItemSizeChange: {
      type: Boolean,
      default: true
    },
    outerElementType: {
      type: String,
      default: isWeb ? 'taro-scroll-view-core' : 'scroll-view'
    },
    innerElementType: {
      type: String,
      default: isWeb ? 'taro-view-core' : 'view'
    },
    itemElementType: {
      type: String,
      default: isWeb ? 'taro-view-core' : 'view'
    },
    outerTagName: String,
    innerTagName: String,
    itemTagName: String,
    outerRef: String,
    innerRef: String,
    onScrollNative: Function,
    onItemsRendered: Function,
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
        startIndex,
        stopIndex
      ) {
        return this.$props.onItemsRendered({
          overscanStartIndex,
          overscanStopIndex,
          startIndex,
          stopIndex
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
            startIndex,
            stopIndex
          ] = this._getRangeToRender()
          this._callOnItemsRendered(
            overscanStartIndex,
            overscanStopIndex,
            startIndex,
            stopIndex
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
        scrollWidth = this.itemList.getOffsetSizeCache(),
        scrollTop,
        scrollLeft,
      } = event.currentTarget
      this.preset.field = {
        scrollHeight,
        scrollWidth,
        scrollTop,
        scrollLeft,
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
        scrollHeight = this.itemList.getOffsetSizeCache(),
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
        scrollHeight,
        scrollWidth,
        scrollTop: scrollOffset,
        scrollLeft,
        clientHeight,
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
        this.preset.resetCache()
      })
    },

    getRenderItemNode (index: number, type: 'node' | 'placeholder' = 'node') {
      const { item, itemData, itemKey = defaultItemKey, useIsScrolling } = this.$props
      const { id, isScrolling } = this.$data
      const key = itemKey(index, itemData)
  
      const style = this.preset.getItemStyle(index)
      if (type === 'placeholder') {
        return render(this.preset.itemElement, {
          key,
          id: `${id}-${index}-wrapper`,
          style: this.preset.isBrick ? style : { display: 'none' }
        })
      }
  
      return render(this.preset.itemElement, {
        key: itemKey(index, itemData),
        id: `${id}-${index}-wrapper`,
        style
      }, render(item, {
        id: `${id}-${index}`,
        data: itemData,
        index,
        isScrolling: useIsScrolling ? isScrolling : undefined
      }))
    },
  
    getRenderColumnNode () {
      const { id, isScrolling } = this.$data
      const { innerRef, itemCount } = this.$props
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
          render(this.preset.itemElement, {
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
  
      for (let itemIndex = 0; itemIndex <= stopIndex + postPlaceholder; itemIndex++) {
        if (!this.preset.isBrick) {
          if (itemIndex < startIndex - prevPlaceholder) {
            itemIndex = startIndex - prevPlaceholder
            continue
          } else if (itemIndex > stopIndex + postPlaceholder) {
            break
          }
        }
  
        if (itemIndex < startIndex || itemIndex > stopIndex) {
          items.push(this.getRenderItemNode(itemIndex, 'placeholder'))
        } else {
          items.push(this.getRenderItemNode(itemIndex))
        }
      }
      return render(this.preset.innerElement, columnProps, items)
    },
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
      direction,
      height,
      layout,
      width,
      enhanced = false
    } = omit(this.$props, [
      'item', 'itemCount', 'itemData', 'itemKey', 'useIsScrolling',
      'innerElementType', 'innerTagName', 'itemElementType', 'itemTagName',
      'outerElementType', 'outerTagName',
      'position'
    ])
    const {
      id,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.$data

    const isHorizontal = this.preset.isHorizontal
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
        scrollY: this.preset.isVertical,
        scrollX: !this.preset.isVertical
      },
      on: {
        scroll: isHorizontal
          ? this._onScrollHorizontal
          : this._onScrollVertical
      }
    }

    if (!enhanced) {
      if (isHorizontal) {
        outerElementProps.scrollLeft = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollLeft
      } else {
        outerElementProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollTop
      }
    }

    return render(this.preset.outerElement, outerElementProps, [
      process.env.FRAMEWORK === 'vue3' ? this.$slots.top?.() : this.$slots.top,
      this.getRenderColumnNode(),
      process.env.FRAMEWORK === 'vue3' ? this.$slots.bottom?.() : this.$slots.bottom,
    ])
  }
}
