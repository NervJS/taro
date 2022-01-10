import { PageInstance } from '@tarojs/runtime'
import { PageConfig } from '@tarojs/taro'

import { bindPageScroll } from './scroll'

export function bindPageEvents (page: PageInstance, config: Partial<PageConfig>) {
  bindPageScroll(page, config)
}
