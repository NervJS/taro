import { isFunction, isNumber } from '@tarojs/shared'
import memoizeOne from 'memoize-one'

import { getOffsetForIndexAndAlignment } from '../../utils'

import type { IProps } from './preset'

type TProps = Pick<IProps, 'column' | 'columnWidth' | 'width' | 'height' | 'itemCount' | 'itemData' | 'itemSize' | 'overscanDistance' | 'unlimitedSize'>

export default class ListMap {
  #columns: number
  #columnMap: [number, number][][] = [] // [itemIndex, itemSize]
  #items: string[] = [] // columnIndex-rowIndex
  mode?: 'normal' | 'function' | 'unlimited'
  minItemSize = 0
  maxItemSize = 0
  defaultSize = 1

  wrapperHeight = 0
  wrapperWidth = 0
  columns = 2
  columnWidth = 0

  refreshCounter = 0

  constructor (protected props: TProps, protected refresh?: TFunc) {
    // Note: 不考虑列表模式切换情况，可能会导致列表抖动体验过差
    if (this.props.unlimitedSize) {
      this.mode = 'unlimited'
    } else if (isFunction(this.props.itemSize)) {
      this.mode = 'function'
    } else if (isNumber(this.props.itemSize)) {
      this.mode = 'normal'
    }

    this.defaultSize = (isFunction(this.props.itemSize) ? this.props.itemSize() : this.props.itemSize) || 1
    this.minItemSize = this.defaultSize
    this.maxItemSize = this.defaultSize
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
    // this.updateItem(this.length - 1)
  }

  updateColumns (columns = 2) {
    this.#columns = columns
    if (!this.isNormalMode && this.#columns !== columns) {
      this.#columnMap = new Array(this.#columns).fill(0).map(() => [])
      this.#items = []
    }
  }

  updateItem (itemIndex: number) {
    if (this.isNormalMode) return
    if (itemIndex >= this.length) return this.updateItem(this.length - 1)

    for (let i = 0; i <= itemIndex; i++) {
      const position = this.getItemPosition(i)
      if (position) continue

      const column = this.minColumnIndex
      const row = this.getColumnLength(column)
      this.#items[i] = `${column}-${row}`
      const itemSize = this.getSizeByPosition(column, row, i)
      if (!this.compareSizeByPosition(column, row, itemSize)) {
        this.setSizeByPosition(column, row, itemSize, i)
      }
    }
  }

  setSizeByPosition (column = 0, row = 0, itemSize = this.defaultSize, itemIndex = this.getItemIndexByPosition(column, row)) {
    if (itemIndex >= 0) {
      if (this.maxItemSize < itemSize || this.maxItemSize === 0) {
        this.maxItemSize = itemSize
      }
      if (this.minItemSize > itemSize || this.minItemSize === 0) {
        this.minItemSize = itemSize
      }
      this.#columnMap[column][row] = [itemIndex, itemSize]
      if (!this.isNormalMode) {
        this.refresh?.()
        this.refreshCounter++
      }
    }
  }

  getSize (itemIndex = 0) {
    const position = this.getItemPosition(itemIndex)
    if (position) {
      return this.getSizeByPosition(...position, itemIndex)
    } else {
      return this.defaultSize
    }
  }

  getSizeByPosition (column = 0, row = 0, itemIndex = this.getItemIndexByPosition(column, row)) {
    if (this.isNormalMode) return this.defaultSize
    let itemSize = this.getColumnList(column)[row]?.[1]
    if (typeof itemSize === 'number') return itemSize

    itemSize = (isFunction(this.props.itemSize) ? this.props.itemSize(itemIndex, this.props.itemData) : this.props.itemSize) || this.defaultSize
    this.setSizeByPosition(column, row, itemSize)
    return itemSize
  }

  // 不支持 normal 模式
  getColumnList (column: number) {
    this.#columnMap[column] ||= []
    return this.#columnMap[column]
  }

  getColumnLength (columnIndex: number) {
    if (this.isNormalMode) return Math.ceil(this.length / this.#columns)

    return this.getColumnList(columnIndex).length
  }

  getColumnSize (columnIndex = 0) {
    if (this.isNormalMode) {
      return this.defaultSize * this.getColumnLength(columnIndex)
    }

    // Note: 不考虑未同步节点情况
    return this.getOffsetSizeCache(columnIndex, this.getColumnLength(columnIndex))
  }

  getItemPosition (itemIndex: number) {
    if (this.isNormalMode) {
      const column = itemIndex % this.#columns
      const row = Math.floor(itemIndex / this.#columns)
      return [column, row]
    }

    return this.#items[itemIndex]?.split('-').map(Number) || false
  }

  getItemIndexByPosition (column = 0, row = 0) {
    if (this.isNormalMode) {
      return row * this.#columns + column
    }

    const columnList = this.getColumnList(column)
    const [itemIndex] = columnList[row] || []
    return itemIndex
  }

  getOffsetSize (itemIndex: number) {
    const [column, row] = this.getItemPosition(itemIndex) || []
    return this.getOffsetSizeCache(column, row)
  }

  getOffsetSizeByPosition (column = 0, row = 0) {
    column = Math.max(0, column)
    row = Math.max(0, row)
    let sum = 0
    for (let i = 0; i < row; i++) {
      sum += this.getSizeByPosition(column, i)
    }
    return sum
  }

  getOffsetSizeCache = memoizeOne((column, row, _flag = this.refreshCounter) => {
    return this.getOffsetSizeByPosition(column, row)
  })

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
    this.updateItem(this.getItemIndexByPosition(column, y))
    x = Math.min(x, columnLength)
    y = Math.min(y, columnLength)
    while (this.getOffsetSizeCache(column, x - 1) < offset && this.getOffsetSizeCache(column, y - 1) > offset && x < y) {
      x < columnLength && x++
      y > 0 && y--
    }
    return Math.max(0, Math.min(this.getOffsetSizeCache(column, x - 1) > offset ? x : y, columnLength) - 1)
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
    this.updateItem(this.getItemIndexByPosition(column, y))
    x = Math.min(x, columnLength)
    y = Math.min(y, columnLength)
    while (this.getOffsetSizeCache(column, x) < offset && this.getOffsetSizeCache(column, y) > offset && x < y) {
      x < columnLength && x++
      y > 0 && y--
    }
    return Math.max(1, Math.min(this.getOffsetSizeCache(column, x) > offset ? x : y, columnLength) + 1)
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

  compareSizeByPosition (column = 0, row = 0, size = this.getSizeByPosition(column, row)) {
    if (this.isNormalMode) return true

    const origenSize = this.#columnMap[column]?.[row]?.[1]
    return typeof origenSize === 'number' && origenSize === size
  }
}
