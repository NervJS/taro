import List from './list'

import type { ElementAttrs, TransformReact2VueType, VueComponentType } from '@tarojs/components/types/index.vue3'
import type { App } from 'vue'
import type { VirtualListProps } from '../'

export type VueVirtualListProps = Omit<VirtualListProps, 'renderTop' | 'renderBottom'>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'virtual-list': ElementAttrs<TransformReact2VueType<VueVirtualListProps>>
    }
  }
}

export const VirtualList = List as unknown as VueComponentType<VueVirtualListProps>

function install (Vue: App) {
  Vue.component('virtual-list', VirtualList)
}

export default {
  install
}
