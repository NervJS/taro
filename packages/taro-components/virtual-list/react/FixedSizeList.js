import createListComponent from './createListComponent'
const FixedSizeList =
/* #__PURE__ */
createListComponent({
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
  }, offset) => Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize))),
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

  shouldResetStyleCacheOnItemSizeChange: true,
  validateProps: ({
    itemSize
  }) => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'number') {
        throw Error('An invalid "itemSize" prop has been specified. ' + 'Value should be a number. ' + `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`)
      }
    }
  }
})
export default FixedSizeList
