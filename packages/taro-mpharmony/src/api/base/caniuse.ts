import Taro from '@tarojs/api'

import * as allAPI from '../../index'

const components = [
  'block',
  'cover-image',
  'cover-view',
  'grid-view',
  'list-view',
  'match-media',
  'movable-area',
  'movable-view',
  'page-container',
  'root-portal',
  'share-element',
  'sticky-header',
  'sticky-section',
  'scroll-view',
  'swiper',
  'swiper-item',
  'view',
  'icon',
  'progress',
  'rich-text',
  'text',
  'button',
  'checkbox',
  'checkbox-group',
]
export const canIUse: typeof Taro.canIUse = (apiName: string) => {
  if (!apiName) {
    return false
  }
  const _apiName = apiName.split('.')[0]
  if (components.includes(_apiName)) {
    return true
  }
  // @ts-ignore
  if (native[_apiName]) {
    return true
  }
  if (allAPI[_apiName] && allAPI[_apiName].toString().indexOf('__taroNotSupport') === -1) {
    return true
  }
  return false
}
