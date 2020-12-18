import createListComponent, { isHorizontalFunc } from './createListComponent'

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

const FixedSizeList =
/* #__PURE__ */
createListComponent({
  getItemOffset (props, index, ref) {
    if (!props.unlimitedSize) {
      return index * props.itemSize
    }
    return ref._getCountSize(props, index)
  },
  getItemSize (props, index, ref) {
    if (!props.unlimitedSize) {
      return props.itemSize
    }

    return ref._getSizeUpload(index, isHorizontalFunc(props))
  },
  getEstimatedTotalSize (props, ref) {
    return ref._getCountSize(props, props.itemCount)
  },
  getOffsetForIndexAndAlignment: (props, id, index, align, scrollOffset, ref) => {
    const { height, width } = props
    const { sizeList } = ref.state
    // TODO Deprecate direction "horizontal"
    const size = isHorizontalFunc(props) ? width : height
    const itemSize = ref._getSize(sizeList[index])
    const lastItemOffset = Math.max(0, ref._getCountSize(props, props.itemCount) - size)
    const maxOffset = Math.min(lastItemOffset, ref._getCountSize(props, index))
    const minOffset = Math.max(0, ref._getCountSize(props, index) - size + itemSize)

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
  getStartIndexForOffset (props, scrollOffset, ref) {
    return Math.max(0, ref._getSizeCount(props, scrollOffset) - 1)
  },
  getStopIndexForStartIndex (props, scrollOffset, startIndex, ref) {
    const {
      height,
      itemCount,
      itemSize,
      width
    } = props
    const size = isHorizontalFunc(props) ? width : height
    const offset = ref._getCountSize(props, startIndex)
    if (!props.unlimitedSize) {
      // TODO Deprecate direction "horizontal"
      const numVisibleItems = Math.ceil((size + scrollOffset - offset) / itemSize)
      /** -1 is because stop index is inclusive */
      return Math.max(startIndex, Math.min(itemCount - 1, startIndex + numVisibleItems - 1))
    }
    return Math.max(startIndex, Math.min(itemCount - 1, ref._getSizeCount(props, size + scrollOffset)))
  },

  initInstanceProps () { // Noop
  },

  shouldResetStyleCacheOnItemSizeChange: true,
  validateProps: (nextProps, prevState) => {
    const { itemCount, itemSize } = nextProps
    const { sizeList } = prevState
    if (itemCount > sizeList.length) {
      const arr = new Array(itemCount - sizeList.length).fill(-1)
      sizeList.push(...arr)
    } else if (itemCount < sizeList.length) {
      sizeList.length = itemCount
    }
    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'number') {
        throw Error('An invalid "itemSize" prop has been specified. ' + 'Value should be a number. ' + `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`)
      }
    }
    validateSharedProps(nextProps, prevState)
  }
})

const validateSharedProps = ({
  children,
  direction,
  height,
  layout,
  itemTagName,
  innerTagName,
  outerTagName,
  width
}, {
  instance
}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (innerTagName != null || outerTagName != null || itemTagName != null) {
      if (devWarningsTagName && !devWarningsTagName.has(instance)) {
        devWarningsTagName.add(instance)
        console.warn('The itemTagName、innerTagName and outerTagName props have been deprecated. ' + 'Please use the itemElementType、innerElementType and outerElementType props instead.')
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

export default FixedSizeList
