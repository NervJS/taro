import { isWebPlatform } from '@tarojs/shared'
import classNames from 'classnames'
import memoizeOne from 'memoize-one'
import { defineComponent } from 'vue'

import { cancelTimeout, convertNumber2PX, defaultItemKey, getRectSizeSync, getScrollViewContextNode, omit, requestTimeout } from '../../../utils'
import render from '../../../utils/vue-render'
import { IS_SCROLLING_DEBOUNCE_INTERVAL } from '../constants'
import Preset, { type IProps } from '../preset'

const isWeb = isWebPlatform()

export default defineComponent({
  props: {
    id: String,
    height: {
      type: [String, Number],
      required: true
    },
    width: {
      type: [String, Number],
      required: true
    },
    column: Number,
    columnWidth: Number,
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
    itemKey: Function,
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
    overscanDistance: {
      type: Number,
      default: 50
    },
    placeholderCount: {
      type: Number,
      default: 0
    },
    useIsScrolling: {
      type: Boolean,
      default: false
    },
    enhanced: {
      type: Boolean,
      default: true
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
    onScrollNative: Function,
    onItemsRendered: Function,
  },
  data () {
    const preset = new Preset(this.$props as IProps, this.refresh as TFunc)
    const id = this.$props.id || preset.id
    preset.updateWrapper(id)

    return {
      itemMap: preset.itemMap,
      preset,
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
    scrollTo (scrollOffset = 0, enhanced = this.preset.enhanced) {
      scrollOffset = Math.max(0, scrollOffset)
      if (this.scrollOffset === scrollOffset) return

      if (enhanced) {
        const option: any = {
          animated: true,
          duration: 300,
        }
        option.top = scrollOffset
        return getScrollViewContextNode(`#${this.preset.id}`).then((node: any) => node.scrollTo(option))
      }

      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = true

      this.$nextTick(this._resetIsScrollingDebounced)
    },

    scrollToItem (index: number, align = 'auto', enhanced = this.preset.enhanced) {
      const { itemCount } = this.$props
      const { scrollOffset } = this.$data

      index = Math.max(0, Math.min(index, itemCount - 1))

      this.scrollTo(
        this.itemMap.getOffsetForIndexAndAlignment(
          index,
          align,
          scrollOffset
        ),
        enhanced,
      )
    },

    _callOnItemsRendered: memoizeOne(function (overscanStartIndex, overscanStopIndex, startIndex, stopIndex) {
      return this.$props.onItemsRendered({
        overscanStartIndex,
        overscanStopIndex,
        startIndex,
        stopIndex
      })
    }),

    _callOnScroll: memoizeOne(function (scrollDirection, scrollOffset, scrollUpdateWasRequested, detail) {
      this.$emit('scroll', {
        scrollDirection,
        scrollOffset,
        scrollUpdateWasRequested,
        detail
      })
    }),

    _callPropsCallbacks () {
      if (typeof this.$props.onItemsRendered === 'function') {
        if (this.$props.itemCount > 0) {
          for (let columnIndex = 0; columnIndex < this.itemMap.columns; columnIndex++) {
            const [overscanStartIndex, overscanStopIndex] = this._getRangeToRender(columnIndex)
            this._callOnItemsRendered(columnIndex, overscanStartIndex, overscanStopIndex)
          }
        }
      }

      if (typeof this.$props.onScroll === 'function') {
        this._callOnScroll(
          this.scrollDirection,
          this.scrollOffset,
          this.scrollUpdateWasRequested,
          this.preset.field
        )
      }

      if (this.itemMap.isUnlimitedMode) {
        setTimeout(() => {
          for (let column = 0; column < this.itemMap.columns; column++) {
            const [startIndex, stopIndex] = this._getRangeToRender(column)
            for (let row = startIndex; row <= stopIndex; row++) {
              const itemIndex = this.itemMap.getItemIndexByPosition(column, row)
              if (itemIndex >= 0 && itemIndex < this.props.itemCount) {
                const times = this.itemMap.compareSizeByPosition(column, row) ? 3 : 0
                getRectSizeSync(`#${this.preset.id}-${itemIndex}`, 100, times).then(({ height }) => {
                  if (typeof height === 'number' && height > 0 && !this.itemMap.compareSizeByPosition(column, row, height)) {
                    this.itemMap.setSizeByPosition(column, row, height)
                  }
                })
              }
            }
          }
        }, 0)
      }
    },

    _getRangeToRender (columnIndex = 0) {
      return this.itemMap.getRangeToRender(
        this.$data.scrollDirection,
        columnIndex,
        this.$data.scrollOffset,
        this.$data.isScrolling
      )
    },

    _outerRefSetter (ref) {
      const { outerRef } = this.$props
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

      this.resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL)
    },

    _resetIsScrolling () {
      this.resetIsScrollingTimeoutId = null
      this.isScrolling = false
      this.$nextTick(() => {
        this.preset.resetCache()
      })
    },

    _onScroll (event) {
      const {
        scrollHeight = this.itemMap.maxColumnSize,
        scrollWidth,
        scrollTop,
        scrollLeft,
      } = event.currentTarget
      const clientHeight = this.itemMap.wrapperHeight
      const clientWidth = this.itemMap.wrapperWidth
      if (this.$props.onScrollNative) {
        this.$props.onScrollNative(event)
      }
      const diffOffset = this.preset.field.scrollTop - scrollTop
      if (this.scrollOffset === scrollTop || this.preset.isShaking(diffOffset)) {
        return
      }

      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
      this.preset.field = {
        scrollHeight: this.itemMap.maxColumnSize,
        scrollWidth,
        scrollTop: scrollOffset,
        scrollLeft,
        clientHeight,
        clientWidth,
        diffOffset: this.preset.field.scrollTop - scrollOffset,
      }

      this.isScrolling = true
      this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
      this.scrollOffset = scrollOffset
      this.scrollUpdateWasRequested = false
      this.$nextTick(this._resetIsScrollingDebounced)
    },

    getRenderItemNode (itemIndex: number, type: 'node' | 'placeholder' = 'node') {
      const { item, itemData, itemKey = defaultItemKey, useIsScrolling } = this.$props
      const { isScrolling } = this.$data
      const key = itemKey(itemIndex, itemData)
  
      const style = this.preset.getItemStyle(itemIndex)
      if (type === 'placeholder') {
        return render(this.preset.itemElement, {
          key,
          id: `${this.preset.id}-${itemIndex}-wrapper`,
          style: this.preset.isBrick ? style : { display: 'none' }
        })
      }
  
      return render(this.preset.itemElement, {
        key,
        id: `${this.preset.id}-${itemIndex}-wrapper`,
        style
      }, render(item, {
        id: `${this.preset.id}-${itemIndex}`,
        data: itemData,
        index: itemIndex,
        isScrolling: useIsScrolling ? isScrolling : undefined
      }))
    },
  
    getRenderColumnNode (columnIndex: number) {
      const columnProps: any = {
        key: `${this.preset.id}-column-${columnIndex}`,
        id: `${this.preset.id}-column-${columnIndex}`,
        style: {
          height: '100%',
          position: 'relative',
          width: convertNumber2PX(this.itemMap.columnWidth)
        }
      }
  
      const [startIndex, stopIndex] = this._getRangeToRender(columnIndex)
      const items = []
      if (this.preset.isRelative && !this.preset.isBrick) {
        const pre = convertNumber2PX(this.itemMap.getOffsetSizeCache(columnIndex, startIndex))
        items.push(
          render(this.preset.itemElement, {
            key: `${this.preset.id}-${columnIndex}-pre`,
            id: `${this.preset.id}-${columnIndex}-pre`,
            style: {
              height: pre,
              width: '100%'
            }
          })
        )
      }
      const placeholderCount = this.preset.placeholderCount
      const restCount = this.itemMap.getColumnLength(columnIndex) - stopIndex
      const prevPlaceholder = startIndex < placeholderCount ? startIndex : placeholderCount
      const postPlaceholder = restCount < placeholderCount ? restCount : placeholderCount
      const visibleItem = (stopIndex + postPlaceholder) * this.itemMap.columns + columnIndex
      this.itemMap.updateItem(visibleItem)
      for (let row = 0; row < stopIndex + postPlaceholder; row++) {
        const itemIndex = this.itemMap.getItemIndexByPosition(columnIndex, row)
        if (itemIndex >= 0 && itemIndex < this.$props.itemCount) {
          if (!this.preset.isBrick) {
            if (row < startIndex - prevPlaceholder) {
              row = startIndex - prevPlaceholder
              continue
            }
          }
  
          if (row < startIndex || row > stopIndex) {
            items.push(this.getRenderItemNode(itemIndex, 'placeholder'))
          } else {
            items.push(this.getRenderItemNode(itemIndex))
          }
        }
      }
      return render(this.preset.innerElement, columnProps, items)
    },

    getRenderExpandNodes (direction: 'top' | 'bottom') {
      const props: any = {
        id: `${this.preset.id}-${direction}`,
        style: {
          visibility: 'hidden',
          height: 100,
          width: '100%',
          marginTop: -100,
          zIndex: -1,
        }
      }
      return render(this.preset.innerElement, props)
    }
  },
  mounted () {
    const { initialScrollOffset } = this.$props

    if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
      const outerRef = this._outerRef
      outerRef.scrollTop = initialScrollOffset
    }

    this._callPropsCallbacks()
    this.preset.boundaryDetection()
  },
  updated () {
    const { scrollOffset, scrollUpdateWasRequested } = this.$data

    this.preset.update(this.$props)

    if (scrollUpdateWasRequested && this._outerRef != null) {
      this._outerRef.scrollTop = scrollOffset
    }

    this._callPropsCallbacks()
  },

  beforeDestroy () {
    if (this.resetIsScrollingTimeoutId !== null) {
      cancelTimeout(this.resetIsScrollingTimeoutId)
    }
    this.preset.dispose()
  },

  render () {
    const {
      height,
      width,
      enhanced = false
    } = omit(this.$props, [
      'item', 'itemCount', 'itemData', 'itemKey', 'useIsScrolling',
      'innerElementType', 'innerTagName', 'itemElementType', 'itemTagName',
      'outerElementType', 'outerTagName', 'onScrollToLower', 'onScrollToUpper',
      'upperThreshold', 'lowerThreshold',
      'position'
    ])
    const {
      isScrolling,
      scrollOffset,
      scrollUpdateWasRequested
    } = this.$data

    const estimatedHeight = convertNumber2PX(this.itemMap.maxColumnSize)
    const outerElementProps: any = {
      id: this.preset.id,
      ref: this._outerRefSetter,
      enhanced,
      class: classNames(this.$attrs.class, 'virtual-waterfall'),
      style: {
        height: convertNumber2PX(height),
        width: convertNumber2PX(width),
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform',
      },
      attrs: {
        scrollY: true,
      },
      on: {
        scroll: this._onScroll
      },
    }

    if (!enhanced) {
      outerElementProps.scrollTop = scrollUpdateWasRequested ? scrollOffset : this.preset.field.scrollTop
    }

    const columnNodes: React.ReactNode[] = []
    for (let i = 0; i < this.itemMap.columns; i++) {
      columnNodes.push(this.getRenderColumnNode(i))
    }

    return render(this.preset.outerElement, outerElementProps, [
      this.getRenderExpandNodes('top'),
      process.env.FRAMEWORK === 'vue3' ? this.$slots.top?.() : this.$slots.top,
      render(this.preset.innerElement, {
        key: `${this.preset.id}-wrapper`,
        id: `${this.preset.id}-wrapper`,
        class: classNames(this.$attrs.class, 'virtual-waterfall-wrapper'),
        style: {
          display: 'flex',
          justifyContent: 'space-evenly',
          pointerEvents: isScrolling ? 'none' : 'auto',
          position: 'relative',
          height: estimatedHeight,
          width: '100%',
        },
      } as any, columnNodes),
      process.env.FRAMEWORK === 'vue3' ? this.$slots.bottom?.() : this.$slots.bottom,
      this.getRenderExpandNodes('bottom'),
    ])
  }
})
