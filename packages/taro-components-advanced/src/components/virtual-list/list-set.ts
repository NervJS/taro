interface IProps {
  unlimitedSize?: boolean
  itemCount?: number
  itemSize?: number
  overscanCount?: number
}

export default class ListSet {
  unlimited = false
  defaultSize = 0
  length = 100
  overscan = 0

  list: number[] = []

  constructor (props: IProps, protected refresh?: TFunc) {
    this.update(props)

    // Note: 不考虑无限制列表切换情况，可能会导致列表抖动体验过差
    if (this.unlimited) {
      this.list = new Array(this.length).fill(-1)
    }
  }

  update ({ unlimitedSize, itemCount, itemSize, overscanCount }: IProps) {
    this.unlimited = unlimitedSize
    this.defaultSize = itemSize
    this.length = itemCount
    this.overscan = overscanCount

    if (itemCount > this.list.length) {
      const arr = new Array(itemCount - this.list.length).fill(-1)
      this.list.push(...arr)
    } else if (itemCount < this.list.length) {
      this.list.length = itemCount
    }
  }

  get (i = 0) {
    return this.list[i]
  }

  setSize (i = 0, size = this.defaultSize) {
    this.list[i] = size
    this.refresh?.()
  }

  compareSize (i = 0, size = 0) {
    if (!this.unlimited) return true
    return this.getSize(i) === size
  }

  getSize (i = 0) {
    if (!this.unlimited) return this.defaultSize
    const item = this.get(i)
    return item >= 0 ? item : this.defaultSize
  }

  getOffsetSize (i = this.list.length) {
    if (!this.unlimited) return i * this.defaultSize
    return this.list.slice(0, i).reduce((sum, _, idx) => sum + this.getSize(idx), 0)
  }

  getSizeCount (offset = 0) {
    if (offset === 0) {
      return 0
    }
    if (!this.unlimited) {
      return Math.min(this.length - 1, Math.floor(offset / this.length))
    }
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
    const visibleOffset = this.getOffsetSize(startIndex)
    if (!this.unlimited) {
      const numVisibleItems = Math.ceil((wrapperSize + scrollOffset - visibleOffset) / this.length)
      /** -1 is because stop index is inclusive */
      return Math.max(startIndex, Math.min(this.length - 1, startIndex + numVisibleItems - 1))
    }
    return Math.max(startIndex, Math.min(this.length - 1, this.getSizeCount(wrapperSize + scrollOffset)))
  }

  getRangeToRender (direction: 'forward' | 'backward', wrapperSize = 0, scrollOffset = 0, block = false) {
    if (this.length === 0) {
      return [0, 0, 0, 0]
    }

    const startIndex = this.getStartIndex(scrollOffset)
    const stopIndex = this.getStopIndex(wrapperSize, scrollOffset, startIndex)

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
}
