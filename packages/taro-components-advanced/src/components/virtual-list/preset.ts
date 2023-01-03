import memoizeOne from 'memoize-one'

import { convertNumber2PX, isCosDistributing } from '../../utils'
import ListSet from './list-set'
import { defaultItemKey, isHorizontalFunc, isRtlFunc } from './utils'

import type { VirtualListProps } from './'

let INSTANCE_ID = 0

export interface IProps extends Partial<VirtualListProps> {
  children?: VirtualListProps['item']
  direction?: 'ltr' | 'rtl' | 'horizontal' | 'vertical'
  itemKey?: typeof defaultItemKey
  itemTagName?: string
  innerTagName?: string
  outerTagName?: string
  itemElementType?: React.ComponentType | string
  outerElementType?: React.ComponentType | string
  innerRef?: React.Ref<HTMLElement> | string
  outerRef?: React.Ref<HTMLElement> | string
  onItemsRendered?: TFunc
  shouldResetStyleCacheOnItemSizeChange?: boolean
}

export default class Preset {
  itemList: ListSet

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

  get id () {
    return `virtual-list-${INSTANCE_ID++}`
  }

  get isHorizontal () {
    return isHorizontalFunc(this.props)
  }

  get isRtl () {
    return isRtlFunc(this.props)
  }

  get isRelative () {
    return this.props.position === 'relative'
  }

  get placeholderCount () {
    return this.props.placeholderCount >= 0 ? this.props.placeholderCount : this.props.overscanCount
  }

  get outerTagName () {
    return this.props.outerElementType || this.props.outerTagName || 'div'
  }

  get innerTagName () {
    return this.props.innerElementType || this.props.innerTagName || 'div'
  }

  get itemTagName () {
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

  isShaking (diff?: number) {
    const list = this.diffList.slice(-3)
    this.diffList.push(diff)
    return list.findIndex(e => Math.abs(e) === Math.abs(diff)) !== -1 || isCosDistributing(this.diffList.slice(-4))
  }

  getItemStyleCache = memoizeOne((
    _itemSize?: IProps['itemSize'] | false,
    _layout?: IProps['layout'] | false,
    _direction?: IProps['direction'] | false
  ) => {
    // TODO: Cache of item styles, keyed by item index.
    return {}
  })

  getItemStyle (index: number) {
    const {
      direction,
      itemSize,
      layout,
      shouldResetStyleCacheOnItemSizeChange
    } = this.props

    const itemStyleCache = this.getItemStyleCache(
      shouldResetStyleCacheOnItemSizeChange ? itemSize : false,
      shouldResetStyleCacheOnItemSizeChange ? layout : false,
      shouldResetStyleCacheOnItemSizeChange ? direction : false
    )

    let style

    const offset = convertNumber2PX(this.itemList.getOffsetSize(index))
    const size = convertNumber2PX(this.itemList.getSize(index))
    const isHorizontal = this.isHorizontal
    const isRtl = this.isRtl
    if (itemStyleCache.hasOwnProperty(index)) {
      // Note: style is frozen.
      style = { ...itemStyleCache[index] }
      if (isHorizontal) {
        style.width = size
        if (!this.isRelative) {
          if (isRtl) {
            style.right = offset
          } else {
            style.left = offset
          }
        }
      } else {
        style.height = size
        if (!this.isRelative) {
          style.top = offset
        }
      }
    } else {
      if (this.isRelative) {
        itemStyleCache[index] = style = {
          height: !isHorizontal ? size : '100%',
          width: isHorizontal ? size : '100%'
        }
      } else {
        const offsetHorizontal = isHorizontal ? offset : 0
        itemStyleCache[index] = style = {
          position: 'absolute',
          left: !isRtl ? offsetHorizontal : undefined,
          right: isRtl ? offsetHorizontal : undefined,
          top: !isHorizontal ? offset : 0,
          height: !isHorizontal ? size : '100%',
          width: isHorizontal ? size : '100%'
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
