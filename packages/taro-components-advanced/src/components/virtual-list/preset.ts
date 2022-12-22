import memoizeOne from 'memoize-one'

import { defaultItemKey, isHorizontalFunc, isRtlFunc } from './utils'

import type { VirtualListProps } from './'

export interface IProps extends Partial<VirtualListProps> {
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
  constructor (protected props: IProps) {
    this.update(this.props)
  }

  update (props: IProps) {
    this.props = props
  }

  get isHorizontal () {
    return isHorizontalFunc(this.props)
  }

  get isRtl () {
    return isRtlFunc(this.props)
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

  getItemStyleCache = memoizeOne((
    _itemSize?: IProps['itemSize'] | false,
    _layout?: IProps['layout'] | false,
    _direction?: IProps['direction'] | false
  ) => {
    // TODO: Cache of item styles, keyed by item index.
    return {}
  })
}