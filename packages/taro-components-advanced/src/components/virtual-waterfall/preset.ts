import { isWebPlatform } from '@tarojs/shared'
import memoizeOne from 'memoize-one'

import { convertNumber2PX, defaultItemKey, getRectSizeSync, isCosDistributing } from '../../utils'
import ListMap from './list-map'

import type { VirtualWaterfallProps } from './'

const isWeb = isWebPlatform()

let INSTANCE_ID = 0

export interface IProps extends Partial<VirtualWaterfallProps> {
  children?: VirtualWaterfallProps['item']
  itemKey?: typeof defaultItemKey
  itemTagName?: string
  innerTagName?: string
  outerTagName?: string
  outerRef?: React.Ref<HTMLElement> | string
  onItemsRendered?: TFunc
  shouldResetStyleCacheOnItemSizeChange?: boolean
}

export default class Preset {
  itemMap: ListMap

  constructor (protected props: IProps, protected refresh?: TFunc) {
    this.init(this.props)
    this.itemMap = new ListMap(this.columns, props, refresh)
  }

  #wrapperField = {
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    diffOffset: 0
  }

  wrapperHeight = 0
  wrapperWidth = 0
  columns = 2
  columnWidth = 0

  diffList: number[] = [0, 0, 0]

  init (props: IProps) {
    this.props = props
  }

  update (props: IProps) {
    this.props = props
    this.itemMap.update(props)
  }

  async updateWrapper (id: string) {
    const { width = 0, height = 0, column, columnWidth } = this.props
    const validWidth = typeof width === 'number' && width > 0
    const validHeight = typeof height === 'number' && height > 0
    if (validWidth) {
      this.wrapperWidth = width
    }
    if (validHeight) {
      this.wrapperHeight = height
      this.itemMap.clientSize = height
    }

    if (!validHeight || !validWidth) {
      const res = await getRectSizeSync(`#${id}`, 100)
      this.wrapperWidth ||= res.width
      this.wrapperHeight ||= res.height
      this.itemMap.clientSize ||= res.height
      this.refresh?.()
    }

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
    this.itemMap.updateColumns(this.columns, this.props)
  }

  get id () {
    return `virtual-waterfall-${INSTANCE_ID++}`
  }

  get isRelative () {
    return this.props.position === 'relative'
  }

  get placeholderCount () {
    return this.props.placeholderCount || 0
  }

  get outerElement () {
    return this.props.outerElementType || this.props.outerTagName || 'div'
  }

  get innerElement () {
    return this.props.innerElementType || this.props.innerTagName || 'div'
  }

  get itemElement () {
    return this.props.itemElementType || this.props.itemTagName || 'div'
  }

  get field () {
    return this.#wrapperField
  }

  set field (o: Record<string, number>) {
    Object.assign(this.#wrapperField, o)
  }

  get enhanced () {
    return this.props.enhanced || true
  }

  isShaking (diff?: number) {
    if (isWeb) return false
    const list = this.diffList.slice(-3)
    this.diffList.push(diff)
    return list.findIndex(e => Math.abs(e) === Math.abs(diff)) !== -1 || isCosDistributing(this.diffList.slice(-4))
  }

  getItemStyleCache = memoizeOne((
    _itemSize?: IProps['itemSize'] | false,
  ) => {
    // TODO: Cache of item styles, keyed by item index.
    return {}
  })

  getItemStyle (index: number) {
    const {
      itemSize,
      shouldResetStyleCacheOnItemSizeChange
    } = this.props

    const itemStyleCache = this.getItemStyleCache(
      shouldResetStyleCacheOnItemSizeChange ? itemSize : false,
    )

    let style

    const [, nodeOffset, nodeSize] = this.itemMap.getItemInfo(index)
    const offset = convertNumber2PX(nodeOffset)
    const size = convertNumber2PX(nodeSize)
    if (itemStyleCache.hasOwnProperty(index)) {
      // Note: style is frozen.
      style = { ...itemStyleCache[index] }
      style.height = size
      if (!this.isRelative) {
        style.top = offset
      }
    } else {
      if (this.isRelative) {
        itemStyleCache[index] = style = {
          height: size,
          width: '100%'
        }
      } else {
        itemStyleCache[index] = style = {
          position: 'absolute',
          left: 0,
          top: offset,
          height: size,
          width: '100%'
        }
      }
    }

    for (const k in style) {
      if (style.hasOwnProperty(k)) {
        style[k] = convertNumber2PX(style[k])
      }
    }

    return style
  }
}
