import { isFunction } from '@tarojs/shared'
import memoizeOne from 'memoize-one'

import { getOffsetForIndexAndAlignment } from '../../utils'
import { isHorizontalFunc } from './utils'

import type { IProps } from './preset'

type TProps = Pick<IProps, 'width' | 'height' | 'unlimitedSize' | 'itemCount' | 'itemData' | 'itemSize' | 'overscanCount' | 'direction' | 'layout'>

export default class ListSet {
  list: number[] = []
  mode?: 'normal' | 'function' | 'unlimited'
  defaultSize = 1

  wrapperHeight = 0
  wrapperWidth = 0

  refreshCounter = 0

  constructor (protected props: TProps, protected refresh?: TFunc) {
    this.update(props)

    // Note: 不考虑列表模式切换情况，可能会导致列表抖动体验过差
    if (this.props.unlimitedSize) {
      this.mode = 'unlimited'
    } else if (isFunction(this.props.itemSize)) {
      this.mode = 'function'
    } else {
      this.mode = 'normal'
    }

    this.defaultSize = (isFunction(this.props.itemSize) ? this.props.itemSize() : this.props.itemSize) || 1

    if (!this.isNormalMode) {
      this.list = new Array(this.length).fill(-1)
    }
  }

  get isNormalMode () {
    return this.mode === 'normal'
  }

  get isFunctionMode () {
    return this.mode === 'function'
  }

  get isUnlimitedMode () {
    return this.mode === 'unlimited'
  }

  get length () {
    return this.props.itemCount || 100
  }

  get overscan () {
    return this.props.overscanCount || 0
  }

  get wrapperSize () {
    return isHorizontalFunc(this.props) ? this.wrapperWidth : this.wrapperHeight
  }

  update (props: TProps) {
    this.props = props

    if (this.length > this.list.length) {
      const arr = new Array(this.length - this.list.length).fill(-1)
      this.list.push(...arr)
    } else if (this.length < this.list.length) {
      this.list.length = this.length
    }
  }

  setSize (i = 0, size = this.defaultSize) {
    this.list[i] = size
    this.refresh?.()
    this.refreshCounter++
  }

  getSize (i = 0) {
    const size = this.props.itemSize
    const item = this.list[i]
    if (item >= 0) return item

    if (this.isFunctionMode && isFunction(size)) {
      const itemSize = size(i, this.props.itemData)
      this.setSize(i, itemSize)
      return itemSize
    }
    return this.defaultSize
  }

  getOffsetSize (i = this.list.length) {
    if (this.isNormalMode) return i * this.defaultSize
    return this.list.slice(0, i).reduce((sum, _, idx) => sum + this.getSize(idx), 0)
  }

  getOffsetSizeCache = memoizeOne((i = this.list.length, _flag = this.refreshCounter) => {
    return this.getOffsetSize(i)
  })

  getSizeCount (offset = 0) {
    if (offset === 0) return 0
    // if (this.isNormalMode) {
    //   return Math.min(this.length - 1, Math.floor(offset / this.length))
    // }
    let offsetSize = 0
    const count = this.list.reduce((sum, _, idx) => {
      if (offsetSize < offset) {
        offsetSize += this.getSize(idx)
        return ++sum
      }
      return sum
    }, 0)
    return count - 1
  }

  getStartIndex (scrollOffset = 0) {
    return Math.max(0, this.getSizeCount(scrollOffset) - 1)
  }

  getStopIndex (wrapperSize = 0, scrollOffset = 0, startIndex = 0) {
    // const visibleOffset = this.getOffsetSizeCache(startIndex)
    // if (this.isNormalMode) {
    //   const numVisibleItems = Math.ceil((wrapperSize + scrollOffset - visibleOffset) / this.length)
    //   /** -1 is because stop index is inclusive */
    //   return Math.max(startIndex, Math.min(this.length - 1, startIndex + numVisibleItems - 1))
    // }
    return Math.max(startIndex, Math.min(this.length - 1, this.getSizeCount(wrapperSize + scrollOffset)))
  }

  getRangeToRender (direction: 'forward' | 'backward', scrollOffset = 0, block = false) {
    if (this.length === 0) {
      return [0, 0, 0, 0]
    }

    const startIndex = this.getStartIndex(scrollOffset)
    const stopIndex = this.getStopIndex(this.wrapperSize, scrollOffset, startIndex)

    // Overscan by one item in each direction so that tab/focus works. If there isn't at least one extra item, tab loops back around.
    const overscanBackward = !block || direction === 'backward' ? Math.max(1, this.overscan) : 1
    const overscanForward = !block || direction === 'forward' ? Math.max(1, this.overscan) : 1
    return [
      Math.max(0, startIndex - overscanBackward),
      Math.max(0, Math.min(this.length - 1, stopIndex + overscanForward)),
      startIndex,
      stopIndex
    ]
  }

  getOffsetForIndexAndAlignment (index: number, align: string, scrollOffset: number) {
    return getOffsetForIndexAndAlignment({
      align,
      containerSize: this.wrapperSize,
      currentOffset: scrollOffset,
      scrollSize: this.getOffsetSizeCache(this.length),
      slideSize: this.getSize(index),
      targetOffset: this.getOffsetSizeCache(index),
    })
  }

  compareSize (i = 0, size = this.defaultSize) {
    if (this.isNormalMode) return true
    return this.getSize(i) === size
  }
}
