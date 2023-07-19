import { isFunction, isNumber } from '@tarojs/shared'

import { getOffsetForIndexAndAlignment } from '../../utils'

import type { IProps } from './preset'

type TProps = Pick<IProps, 'column' | 'columnWidth' | 'width' | 'height' | 'itemCount' | 'itemData' | 'itemSize' | 'overscanDistance' | 'unlimitedSize'>

export default class ListMap {
  #columns: number
  #columnMap: [number, number][][] = [] // [itemIndex, itemSize]
  #items: [number, number][] = [] // [columnIndex, rowIndex]
  mode?: 'normal' | 'function' | 'unlimited'
  minItemSize = 0
  maxItemSize = 0
  defaultSize = 1

  wrapperHeight = 0
  wrapperWidth = 0
  columns = 2
  columnWidth = 0

  constructor (protected props: TProps, protected refresh?: TFunc) {
    // Note: 不考虑列表模式切换情况，可能会导致列表抖动体验过差
    if (this.props.unlimitedSize) {
      this.mode = 'unlimited'
    } else if (isFunction(this.props.itemSize)) {
      this.mode = 'function'
    } else if (isNumber(this.props.itemSize)) {
      this.mode = 'normal'
      this.minItemSize = this.props.itemSize
      this.maxItemSize = this.props.itemSize
    }

    this.defaultSize = (isFunction(this.props.itemSize) ? this.props.itemSize() : this.props.itemSize) || 1
    this.update(props)
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
    return this.props.overscanDistance || 50
  }

  get columnsSize () {
    if (this.isNormalMode) {
      return new Array(this.#columns).fill(this.getColumnSize())
    }

    return new Array(this.#columns).fill(0).map((_, i) => this.getColumnSize(i))
  }

  get maxColumnSize () {
    if (this.isNormalMode) return this.getColumnSize()

    return Math.max(...this.columnsSize)
  }

  get minColumnSize () {
    if (this.isNormalMode) return this.getColumnSize()

    return Math.min(...this.columnsSize)
  }

  get maxColumnIndex () {
    if (this.isNormalMode) return 0

    const list = this.columnsSize
    return list.indexOf(Math.max(...list))
  }

  get minColumnIndex () {
    if (this.isNormalMode) return 0

    const list = this.columnsSize
    return list.indexOf(Math.min(...list))
  }

  update (props: TProps) {
    this.props = props

    const { column, columnWidth } = this.props
    if (typeof column === 'number' && column > 0) {
      this.columns = column
      this.columnWidth = this.wrapperWidth / column
    } else if (typeof columnWidth === 'number' && columnWidth > 0) {
      this.columns = Math.floor(this.wrapperWidth / columnWidth)
      this.columnWidth = columnWidth
    } else {
      this.columns = 2
      this.columnWidth = this.wrapperWidth / this.columns
    }
    this.updateColumns(this.columns)

    if (!this.isNormalMode) {
      this.updateItem(this.length - 1)
    }
  }

  updateColumns (columns = 2) {
    this.#columns = columns
    if (!this.isNormalMode) {
      this.#columnMap = new Array(this.#columns).fill(0).map(() => [])
      this.#items = []
    }
  }

  // 不支持 normal 模式
  updateItem (itemIndex: number) {
    if (itemIndex >= this.length) {
      return this.updateItem(this.length - 1)
    }

    if (!this.#items[itemIndex]) {
      const itemSizeFunc = this.props.itemSize as Exclude<TProps['itemSize'], number>
      const itemSize = itemSizeFunc(itemIndex, this.props.itemData)
      if (this.maxItemSize < itemSize || this.maxItemSize === 0) {
        this.maxItemSize = itemSize
      }
      if (this.minItemSize > itemSize || this.minItemSize === 0) {
        this.minItemSize = itemSize
      }

      if (itemIndex > 0) {
        // Note: 判断上一个 item 是否在同步
        const lastIndex = itemIndex - 1
        const position = this.getItemPosition(lastIndex)
        if (!position) this.updateItem(lastIndex)
      }

      const column = this.minColumnIndex
      const row = this.getColumnList(column).length

      this.#items[itemIndex] = [column, row]
      const columnList = this.getColumnList(column)
      columnList[row] = [itemIndex, itemSize]
    }
  }

  setSize (itemIndex = 0, size = this.defaultSize) {
    const position = this.getItemPosition(itemIndex)
    if (position) {
      const [column, row] = position
      this.#columnMap[column][row] = [itemIndex, size]
      if (this.isUnlimitedMode) {
        this.refresh?.()
      }
    }
  }

  getSize (itemIndex = 0) {
    const size = this.props.itemSize
    const position = this.getItemPosition(itemIndex)
    if (!position) return this.defaultSize

    if (this.isFunctionMode && isFunction(size)) {
      const itemSize = size(itemIndex, this.props.itemData)
      this.setSize(itemIndex, itemSize)
      return itemSize
    }
    return this.defaultSize
  }

  // 不支持 normal 模式
  getColumnList (columnIndex: number) {
    this.#columnMap[columnIndex] ||= []
    return this.#columnMap[columnIndex]
  }

  getColumnSize (columnIndex = 0) {
    if (this.isNormalMode) {
      const columnLength = Math.ceil(this.length / this.#columns)
      return this.defaultSize * columnLength
    }

    // Note: 不考虑未同步节点情况
    const columnList = this.getColumnList(columnIndex)
    return this.getOffsetFormPosition(columnIndex, columnList.length)
  }

  getItemPosition (itemIndex: number) {
    if (this.isNormalMode) {
      const column = itemIndex % this.#columns
      const row = Math.floor(itemIndex / this.#columns)
      return [column, row]
    }

    return this.#items[itemIndex] || false
  }

  getItemIndexFromPosition (column = 0, row = 0) {
    if (this.isNormalMode) {
      return row * this.#columns + column
    }

    const columnList = this.getColumnList(column)
    const [itemIndex] = columnList[row] || []
    return itemIndex
  }

  getItemInfo (itemIndex: number) {
    const [column, row] = this.getItemPosition(itemIndex) || []
    if (this.isNormalMode) {
      return [itemIndex, this.defaultSize]
    }

    if (typeof column !== 'number') {
      this.updateItem(itemIndex)
    }
    const columnList = this.getColumnList(column)
    if (!(columnList[row] instanceof Array)) {
      this.updateItem(itemIndex)
    }
    return columnList[row] || []
  }

  getItemsInfoFromPosition (column = 0, row = 0) {
    const columnList = this.getColumnList(column)
    const itemIndex = this.getItemIndexFromPosition(column, row)
    if (this.isNormalMode) {
      return [itemIndex, this.defaultSize]
    }

    if (!(columnList[row] instanceof Array)) {
      this.updateItem(Math.min(itemIndex, this.length - 1))
    }
    return columnList[row] || []
  }

  getItemDetail (itemIndex: number) {
    return this.props.itemData[itemIndex]
  }

  getOffsetSize (itemIndex: number) {
    const [column, row] = this.getItemPosition(itemIndex) || []
    return this.getOffsetFormPosition(column, row)
  }

  getOffsetFormPosition (column = 0, row = 0) {
    column = Math.max(0, column)
    row = Math.max(0, row)
    const columnList = this.getColumnList(column)
    return columnList.slice(0, row).reduce((sum, [, size]) => sum + size, 0)
  }

  getStartIndex (column: number, offset: number) {
    if (offset <= 0) return 0
    if (this.isNormalMode) {
      const size = this.minItemSize || 1
      return Math.max(0, Math.floor(offset / size))
    }

    const columnList = this.getColumnList(column)
    const columnLength = columnList.length - 1
    let x = Math.floor(offset / (this.maxItemSize || 1))
    let y = Math.ceil(offset / (this.minItemSize || 1))
    this.updateItem(this.getItemIndexFromPosition(column, y))
    x = Math.min(x, columnLength)
    y = Math.min(y, columnLength)
    while (this.getOffsetFormPosition(column, x - 1) < offset && this.getOffsetFormPosition(column, y - 1) > offset && x < y) {
      x < columnLength && x++
      y > 0 && y--
      if (!columnList[x]) this.updateItem(this.getItemIndexFromPosition(column, x))
      if (!columnList[y]) this.updateItem(this.getItemIndexFromPosition(column, y))
    }
    return Math.max(0, Math.min(this.getOffsetFormPosition(column, x - 1) > offset ? x : y, columnLength) - 1)
  }

  getStopIndex (column: number, offset: number, start = 0) {
    if (offset <= 0) return 0
    if (this.isNormalMode) {
      const size = this.minItemSize || 1
      const count = Math.ceil(offset / size)
      return Math.min(count, this.getColumnSize(column))
    }
    const columnList = this.getColumnList(column)
    const columnLength = columnList.length - 1
    let x = Math.max(start, Math.floor(offset / (this.maxItemSize || 1)))
    let y = Math.max(start, Math.ceil(offset / (this.minItemSize || 1)))
    this.updateItem(this.getItemIndexFromPosition(column, y))
    x = Math.min(x, columnLength)
    y = Math.min(y, columnLength)
    while (this.getOffsetFormPosition(column, x) < offset && this.getOffsetFormPosition(column, y) > offset && x < y) {
      x < columnLength && x++
      y > 0 && y--
      if (!columnList[x]) this.updateItem(this.getItemIndexFromPosition(column, x))
      if (!columnList[y]) this.updateItem(this.getItemIndexFromPosition(column, y))
    }
    return Math.max(1, Math.min(this.getOffsetFormPosition(column, x) > offset ? x : y, columnLength) + 1)
  }

  getRangeToRender (direction: 'forward' | 'backward', column: number, offset: number, block = false) {
    if (this.length === 0) return [0, 0]

    const scrollSize = this.maxColumnSize
    const backwardDistance = !block || direction === 'backward' ? Math.max(0, this.overscan) : 0
    const forwardDistance = !block || direction === 'forward' ? Math.max(0, this.overscan) : 0

    const overscanBackward = this.getStartIndex(column, Math.max(0, offset - this.wrapperHeight - backwardDistance))
    const overscanForward = this.getStopIndex(column, Math.max(0, Math.min(scrollSize, offset + this.wrapperHeight + forwardDistance)), overscanBackward)
    return [overscanBackward, overscanForward]
  }

  getOffsetForIndexAndAlignment (index: number, align: string, scrollOffset: number) {
    return getOffsetForIndexAndAlignment({
      align,
      containerSize: this.wrapperHeight,
      currentOffset: scrollOffset,
      scrollSize: this.getOffsetSize(this.length),
      slideSize: this.getColumnSize(index),
      targetOffset: this.getOffsetSize(index),
    })
  }

  compareSize (itemIndex = 0, size = 0) {
    if (this.isNormalMode) return true
    return this.getSize(itemIndex) === size
  }
}
