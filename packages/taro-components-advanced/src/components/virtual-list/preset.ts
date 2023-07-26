import * as CSS from 'csstype'
import memoizeOne from 'memoize-one'

import { convertNumber2PX, defaultItemKey, getRectSizeSync, isCosDistributing } from '../../utils'
import ListSet from './list-set'
import { isHorizontalFunc, isRtlFunc } from './utils'

import type { VirtualListProps } from './'

let INSTANCE_ID = 0

export interface IProps extends Partial<VirtualListProps> {
  children?: VirtualListProps['item']
  direction?: 'ltr' | 'rtl' | 'horizontal' | 'vertical'
  itemKey?: typeof defaultItemKey
  itemTagName?: string
  innerTagName?: string
  outerTagName?: string
  innerRef?: React.Ref<HTMLElement> | string
  outerRef?: React.Ref<HTMLElement> | string
  onItemsRendered?: TFunc
  shouldResetStyleCacheOnItemSizeChange?: boolean
  outerWrapper?: React.FC
}

export default class Preset {
  itemList: ListSet
  #id: string

  constructor (protected props: IProps, protected refresh?: TFunc) {
    this.init(this.props)
    this.itemList = new ListSet(props, refresh)
  }

  wrapperField = {
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    diffOffset: 0
  }

  diffList: number[] = [0, 0, 0]

  init (props: IProps) {
    this.props = props
  }

  update (props: IProps) {
    this.props = props
    this.itemList.update(props)
  }

  async updateWrapper (id: string) {
    this.id = id
    const { width = 0, height = 0 } = this.props
    const validWidth = typeof width === 'number' && width > 0
    const validHeight = typeof height === 'number' && height > 0
    if (validWidth) {
      this.itemList.wrapperWidth = width
    }
    if (validHeight) {
      this.itemList.wrapperHeight = height
    }

    if (!validHeight || !validWidth) {
      const res = await getRectSizeSync(`#${id}`, 100)
      this.itemList.wrapperWidth ||= res.width
      this.itemList.wrapperHeight ||= res.height
      this.refresh?.()
    }

    this.itemList.update(this.props)
  }

  set id (id: string) {
    this.#id = id
  }

  get id () {
    this.#id ||= `virtual-waterfall-${INSTANCE_ID++}`
    return this.#id
  }

  get isHorizontal () {
    return isHorizontalFunc(this.props)
  }

  get isRtl () {
    return isRtlFunc(this.props)
  }

  get isRelative () {
    return this.props.position && this.props.position !== 'absolute'
  }

  get isBrick () {
    return this.props.position === 'brick'
  }

  get placeholderCount () {
    return this.props.placeholderCount >= 0 ? this.props.placeholderCount : this.props.overscanCount
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
    return this.wrapperField
  }

  set field (o: Record<string, number>) {
    Object.assign(this.wrapperField, o)
    // Object.keys(o).forEach(key => {
    //   if (typeof o[key] === 'number' && typeof this.wrapperField[key] === 'number') {
    //     this.wrapperField[key] = o[key]
    //   }
    // })
  }

  get enhanced () {
    return this.props.enhanced || true
  }

  isShaking (diff?: number) {
    const list = this.diffList.slice(-3)
    this.diffList.push(diff)
    return list.findIndex(e => Math.abs(e) === Math.abs(diff)) !== -1 || isCosDistributing(this.diffList.slice(-4))
  }

  resetCache () {
    this.itemList.refreshCounter++
  }

  getItemStyleCache = memoizeOne((
    itemIndex?: number,
    itemSize?: IProps['itemSize'] | false,
    _flag = this.itemList.refreshCounter
  ) => {
    itemSize = itemSize || this.itemList.getSize(itemIndex)
    const style: CSS.Properties<string | number> = this.isRelative ? {} : {
      position: 'absolute',
    }
    const offset = convertNumber2PX(this.itemList.getOffsetSizeCache(itemIndex))
    const size = convertNumber2PX(this.itemList.getSize(itemIndex))
    const isHorizontal = this.isHorizontal
    const isRtl = this.isRtl
    style.height = !isHorizontal ? size : '100%'
    style.width = isHorizontal ? size : '100%'
    if (!this.isRelative) {
      const offsetHorizontal = isHorizontal ? offset : 0
      style.top = !isHorizontal ? offset : 0
      if (isRtl) {
        style.right = offsetHorizontal
      } else {
        style.left = offsetHorizontal
      }
    }

    return style
  })

  getItemStyle (index: number) {
    const {
      shouldResetStyleCacheOnItemSizeChange
    } = this.props

    return this.getItemStyleCache(
      index,
      shouldResetStyleCacheOnItemSizeChange ? this.itemList.getSize(index) : false,
    )
  }
}
