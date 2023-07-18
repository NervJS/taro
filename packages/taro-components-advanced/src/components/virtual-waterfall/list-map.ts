import { isFunction, isNumber } from '@tarojs/shared'

import { getOffsetForIndexAndAlignment } from '../../utils'

import type { IProps } from './preset'

type TProps = Pick<IProps, 'width' | 'height' | 'itemCount' | 'itemData' | 'itemSize' | 'overscanDistance'>

type TItem = [number, number, number] // [itemIndex, startPosition, itemSize]

export default class ListMap {
  #columns: number
  #columnMap: TItem[][] = [] // [itemIndex, startPosition, itemSize]
  #items: [number, number][] = [] // [columnIndex, rowIndex]
  mode?: 'normal' | 'function'
  clientSize = 0
  minItemSize = 0
  maxItemSize = 0

  constructor (columns = 2, protected props: TProps, protected refresh?: TFunc) {
    if (isFunction(this.props.itemSize)) {
      this.mode = 'function'
    } else if (isNumber(this.props.itemSize)) {
      this.mode = 'normal'
      this.minItemSize = this.props.itemSize
      this.maxItemSize = this.props.itemSize
    }

    this.updateColumns(columns, props)
  }

  updateColumns (columns = 2, props: TProps) {
    this.#columns = columns
    if (!this.isNormalMode) {
      this.#columnMap = new Array(this.#columns).fill(0).map(() => [])
      this.#items = []
      this.update(props)
    }
  }

  update (props: TProps) {
    this.props = props

    if (!this.isNormalMode) {
      this.updateItem(this.length - 1)
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
      let startPosition = 0
      if (row > 0) {
        const [, lastStart, lastSize] = this.getItemsInfoFromPosition(column, row - 1)
        startPosition = lastStart + lastSize
      }

      this.#items[itemIndex] = [column, row]
      const list = this.getColumnList(column)
      list[row] = [itemIndex, startPosition, itemSize]
    }
  }

  get isNormalMode () {
    return this.mode === 'normal'
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

  // 不支持 normal 模式
  getColumnList (columnIndex: number) {
    this.#columnMap[columnIndex] ||= []
    return this.#columnMap[columnIndex]
  }

  getColumnSize (columnIndex = 0) {
    if (this.isNormalMode) {
      const columnLength = Math.ceil(this.length / this.#columns)
      return this.minItemSize * columnLength
    }

    // Note: 不考虑未同步节点情况
    const columns = this.getColumnList(columnIndex)
    const [, start = 0, size = 0] = columns[columns.length - 1] || []
    return start + size
  }

  getItemPosition (itemIndex: number) {
    if (this.isNormalMode) {
      const column = itemIndex % this.#columns
      const row = Math.floor(itemIndex / this.#columns)
      return [column, row]
    }

    return this.#items[itemIndex] || false
  }

  getItemInfo (itemIndex: number) {
    const [column, row] = this.getItemPosition(itemIndex) || []
    if (this.isNormalMode) {
      const itemSize = this.minItemSize
      const startPosition = row * itemSize
      return [itemIndex, startPosition, itemSize]
    }

    if (typeof column !== 'number') {
      this.updateItem(itemIndex)
    }
    const list = this.getColumnList(column)
    if (!(list[row] instanceof Array)) {
      this.updateItem(itemIndex)
    }
    return list[row]
  }

  getItemsInfoFromPosition (column = 0, row = 0) {
    const list = this.getColumnList(column)
    const itemIndex = row * this.#columns + column
    if (this.isNormalMode) {
      const itemSize = this.minItemSize
      const startPosition = row * itemSize
      return [itemIndex, startPosition, itemSize]
    }

    if (!(list[row] instanceof Array)) {
      this.updateItem(Math.min(itemIndex, this.length - 1))
    }
    return list[row] || []
  }

  getItemDetail (itemIndex: number) {
    return this.props.itemData[itemIndex]
  }

  getOffsetSize (itemIndex: number) {
    const [, start] = this.getItemInfo(itemIndex)
    return start
  }

  getStartItems (offset: number) {
    const list = new Array(this.#columns).fill(0)
    offset = Math.max(0, offset - this.overscan)
    if (this.isNormalMode) {
      const size = this.minItemSize || 1
      const count = Math.max(0, Math.floor(offset / size))
      return list.map(() => count)
    } else {
      return list.map((_, i) => this.getStartIndex(i, offset))
    }
  }

  getStartIndex (column: number, offset: number) {
    const getOffset = ([, start = 0]: TItem = [0, 0, 0]) => start
    if (offset <= 0) return 0
    if (this.isNormalMode) {
      const size = this.minItemSize || 1
      return Math.max(0, Math.floor(offset / size))
    }

    const columns = this.getColumnList(column)
    let x = Math.floor(offset / (this.maxItemSize || 1))
    let y = Math.ceil(offset / (this.minItemSize || 1))
    this.updateItem(y * this.#columns + column)
    x = Math.min(x, columns.length - 1)
    y = Math.min(y, columns.length - 1)
    while (getOffset(columns[x]) < offset && getOffset(columns[y]) > offset && x < y) {
      x + 1 < columns.length && x++
      y > 0 && y--
      if (!columns[x]) this.updateItem(x * this.#columns + column)
      if (!columns[y]) this.updateItem(y * this.#columns + column)
    }
    return Math.max(0, Math.min(getOffset(columns[x]) > offset ? x : y, columns.length - 1) - 1)
  }

  getStopIndex (column: number, offset: number, start = 0) {
    const getOffset = ([, start = 0, size = 0]: TItem = [0, 0, 0]) => start + size
    if (offset <= 0) return 0
    if (this.isNormalMode) {
      const size = this.minItemSize || 1
      const count = Math.ceil(offset / size)
      return Math.min(count, this.getColumnSize(column))
    }
    const columns = this.getColumnList(column)
    let x = Math.max(start, Math.floor(offset / (this.maxItemSize || 1)))
    let y = Math.max(start, Math.ceil(offset / (this.minItemSize || 1)))
    this.updateItem(y * this.#columns + column)
    x = Math.min(x, columns.length - 1)
    y = Math.min(y, columns.length - 1)
    while (getOffset(columns[x]) < offset && getOffset(columns[y]) > offset && x < y) {
      x + 1 < columns.length && x++
      y > 0 && y--
      if (!columns[x]) this.updateItem(x * this.#columns + column)
      if (!columns[y]) this.updateItem(y * this.#columns + column)
    }
    return Math.max(1, Math.min(getOffset(columns[x]) > offset ? x : y, columns.length - 1) + 1)
  }

  getRangeToRender (direction: 'forward' | 'backward', column: number, offset: number, block = false) {
    if (this.length === 0) return [0, 0]

    const clientSize = this.clientSize
    const scrollSize = this.maxColumnSize
    const backwardDistance = !block || direction === 'backward' ? Math.max(0, this.overscan) : 0
    const forwardDistance = !block || direction === 'forward' ? Math.max(0, this.overscan) : 0

    const overscanBackward = this.getStartIndex(column, Math.max(0, offset - backwardDistance))
    const overscanForward = this.getStopIndex(column, Math.max(0, Math.min(scrollSize, clientSize + offset + forwardDistance)), overscanBackward)
    return [overscanBackward, overscanForward]
  }

  getOffsetForIndexAndAlignment (index: number, align: string, scrollOffset: number) {
    return getOffsetForIndexAndAlignment({
      align,
      containerSize: this.clientSize,
      currentOffset: scrollOffset,
      scrollSize: this.getOffsetSize(this.length),
      slideSize: this.getColumnSize(index),
      targetOffset: this.getOffsetSize(index),
    })
  }

  // Note: 不支持动态更新。不需要对比节点大小
  // compareSize
}
