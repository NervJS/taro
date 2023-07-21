import { isWebPlatform } from '@tarojs/shared'
import * as CSS from 'csstype'
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
  #id: string

  constructor (protected props: IProps, protected refresh?: TFunc) {
    this.init(this.props)
    this.itemMap = new ListMap(props, refresh)
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

  diffList: number[] = [0, 0, 0]

  init (props: IProps) {
    this.props = props
  }

  update (props: IProps) {
    this.props = props
    this.itemMap.update(props)
  }

  async updateWrapper (id: string) {
    this.id = id
    const { width = 0, height = 0 } = this.props
    const validWidth = typeof width === 'number' && width > 0
    const validHeight = typeof height === 'number' && height > 0
    if (validWidth) {
      this.itemMap.wrapperWidth = width
    }
    if (validHeight) {
      this.itemMap.wrapperHeight = height
    }

    if (!validHeight || !validWidth) {
      const res = await getRectSizeSync(`#${id}`, 100)
      this.itemMap.wrapperWidth ||= res.width
      this.itemMap.wrapperHeight ||= res.height
      this.refresh?.()
    }

    this.itemMap.update(this.props)
  }

  set id (id: string) {
    this.#id = id
  }

  get id () {
    this.#id ||= `virtual-waterfall-${INSTANCE_ID++}`
    return this.#id
  }

  get isRelative () {
    return this.props.position && this.props.position !== 'absolute'
  }

  get isBrick () {
    return this.props.position === 'brick'
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
    if (isWeb || this.props.enhanced) return false
    const list = this.diffList.slice(-3)
    this.diffList.push(diff)
    return list.findIndex(e => Math.abs(e) === Math.abs(diff)) !== -1 || isCosDistributing(this.diffList.slice(-4))
  }

  getItemStyleCache = memoizeOne((
    itemIndex?: number,
    itemSize?: IProps['itemSize'] | false,
    _flag = this.itemMap.refreshCounter
  ) => {
    itemSize = itemSize || this.itemMap.getSize(itemIndex)
    const style: CSS.Properties<string | number> = this.isRelative ? {} : {
      position: 'absolute',
      left: 0,
    }
    style.width = '100%'
    style.height = convertNumber2PX(itemSize)
    if (!this.isRelative) {
      const nodeOffset = this.itemMap.getOffsetSize(itemIndex)
      style.top = convertNumber2PX(nodeOffset)
    }
    return style
  })

  getItemStyle (itemIndex: number) {
    const {
      shouldResetStyleCacheOnItemSizeChange
    } = this.props

    return this.getItemStyleCache(
      itemIndex,
      shouldResetStyleCacheOnItemSizeChange ? this.itemMap.getSize(itemIndex) : false,
    )
  }
}
