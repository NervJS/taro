import { memoizeOne } from '../memoize'
import { cancelTimeout, requestTimeout } from '../timer'
import { getRTLOffsetType } from '../domHelpers'

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150

const defaultItemKey = (index) => index

function createListComponent ({
  getItemOffset,
  getEstimatedTotalSize,
  getItemSize,
  getOffsetForIndexAndAlignment,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
  shouldResetStyleCacheOnItemSizeChange,
  Vue
}) {
  return {
    props: {
      direction: {
        type: String,
        default: 'ltr'
      },
      itemData: Array,
      layout: {
        type: String,
        default: 'vertical'
      },
      useIsScrolling: {
        type: Boolean,
        default: false
      },
      overscanCount: {
        type: Number,
        default: 1
      },
      wclass: String,
      height: {},
      innerRef: String,
      innerElementType: {
        type: String,
        default: 'view'
      },
      itemCount: Number,
      wstyle: String,
      width: String,
      itemSize: {
        required: true
      },
      item: {
        required: true
      },
      initialScrollOffset: {
        type: String,
        defalt: 0
      },
      scrollNative: Function
    },
    data () {
      return {
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
      _instanceProps () {
        initInstanceProps(this.$props, this)
      },
      scrollTo (scrollOffset) {
        scrollOffset = Math.max(0, scrollOffset)

        if (this.scrollOffset === scrollOffset) {
          return
        }

        this.scrollDirection = this.scrollOffset < scrollOffset ? 'forward' : 'backward'
        this.scrollOffset = scrollOffset
        this.scrollUpdateWasRequested = true

        Vue.nextTick(this._resetIsScrollingDebounced)
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
            scrollOffset,
            this._instanceProps()
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

      _getStyleValue (value) {
        return typeof value === 'number'
          ? value + 'px'
          : value == null
            ? ''
            : value
      },

      _getItemStyle (index) {
        const { direction, itemSize, layout } = this.$props

        const itemStyleCache = this._getItemStyleCache(
          shouldResetStyleCacheOnItemSizeChange && itemSize,
          shouldResetStyleCacheOnItemSizeChange && layout,
          shouldResetStyleCacheOnItemSizeChange && direction
        )

        let style
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index]
        } else {
          const offset = getItemOffset(this.$props, index, this._instanceProps())
          const size = getItemSize(this.$props, index, this._instanceProps())

          // TODO Deprecate direction "horizontal"
          const isHorizontal =
            direction === 'horizontal' || layout === 'horizontal'

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
      },

      _getItemStyleCache: memoizeOne(() => ({})),

      _getRangeToRender () {
        const { itemCount, overscanCount } = this.$props
        const { isScrolling, scrollDirection, scrollOffset } = this.$data

        if (itemCount === 0) {
          return [0, 0, 0, 0]
        }

        const startIndex = getStartIndexForOffset(
          this.$props,
          scrollOffset,
          this._instanceProps()
        )
        const stopIndex = getStopIndexForStartIndex(
          this.$props,
          startIndex,
          scrollOffset,
          this._instanceProps()
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
        if (this.$props.scrollNative) {
          this.$props.scrollNative(event)
        }
        if (this.scrollOffset === scrollLeft) {
          return
        }
        const { direction } = this.$props

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
        Vue.nextTick(this._resetIsScrollingDebounced)
      },

      _onScrollVertical (event) {
        const clientHeight = this.$props.height
        const { scrollHeight, scrollTop } = event.currentTarget
        if (this.$props.scrollNative) {
          this.$props.scrollNative(event)
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
        Vue.nextTick(this._resetIsScrollingDebounced)
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
        Vue.nextTick(() => {
          this._getItemStyleCache(-1, null)
        })
      }
    },
    mounted () {
      const { direction, initialScrollOffset, layout } = this.$props

      if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
        const outerRef = this._outerRef
        // TODO Deprecate direction "horizontal"
        if (direction === 'horizontal' || layout === 'horizontal') {
          outerRef.scrollLeft = initialScrollOffset
        } else {
          outerRef.scrollTop = initialScrollOffset
        }
      }

      this._callPropsCallbacks()
    },
    updated () {
      const { direction, layout } = this.$props
      const { scrollOffset, scrollUpdateWasRequested } = this.$data

      if (scrollUpdateWasRequested && this._outerRef != null) {
        const outerRef = this._outerRef

        // TODO Deprecate direction "horizontal"
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

    render (h) {
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

      // TODO Deprecate direction "horizontal"
      const isHorizontal =
        direction === 'horizontal' || layout === 'horizontal'

      const onScroll = isHorizontal
        ? this._onScrollHorizontal
        : this._onScrollVertical

      const [startIndex, stopIndex] = this._getRangeToRender()

      const items = []
      if (itemCount > 0) {
        for (let index = startIndex; index <= stopIndex; index++) {
          items.push(
            h(item, {
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
        this.$props,
        this._instanceProps()
      )

      return h(
        'scroll-view',
        {
          class: wclass,
          ref: this._outerRefSetter,
          style: {
            position: 'relative',
            height: this._getStyleValue(height),
            width: this._getStyleValue(width),
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
          h(
            innerElementType,
            {
              ref: innerRef,
              style: {
                height: this._getStyleValue(isHorizontal ? '100%' : estimatedTotalSize),
                pointerEvents: isScrolling ? 'none' : undefined,
                width: this._getStyleValue(isHorizontal ? estimatedTotalSize : '100%')
              }
            },
            items
          )
        ]
      )
    }
  }
}

export default {
  install: (Vue) => {
    const VirtualList = createListComponent({
      Vue,
      getItemOffset: ({
        itemSize
      }, index) => index * itemSize,
      getItemSize: ({
        itemSize
      }) => itemSize,
      getEstimatedTotalSize: ({
        itemCount,
        itemSize
      }) => itemSize * itemCount,
      getOffsetForIndexAndAlignment: ({
        direction,
        height,
        itemCount,
        itemSize,
        layout,
        width
      }, index, align, scrollOffset) => {
        // TODO Deprecate direction "horizontal"
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal'
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
      },
      getStartIndexForOffset: ({
        itemCount,
        itemSize
      }, offset) => {
        return Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize)))
      },
      getStopIndexForStartIndex: ({
        direction,
        height,
        itemCount,
        itemSize,
        layout,
        width
      }, startIndex, scrollOffset) => {
        // TODO Deprecate direction "horizontal"
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal'
        const offset = startIndex * itemSize
        const size = isHorizontal ? width : height
        const numVisibleItems = Math.ceil((size + scrollOffset - offset) / itemSize)
        return Math.max(0, Math.min(itemCount - 1, startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
        ))
      },

      initInstanceProps () { // Noop
      },

      shouldResetStyleCacheOnItemSizeChange: true
    })
    Vue.component('virtual-list', VirtualList)
  }
}
