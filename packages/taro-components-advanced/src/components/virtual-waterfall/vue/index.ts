import Waterfall from './waterfall'

import type { ElementAttrs, TransformReact2VueType, VueComponentType } from '@tarojs/components/types/index.vue3'
import type { App } from 'vue'
import type { VirtualWaterfallProps } from '../'

export type VueVirtualWaterfallProps = Omit<VirtualWaterfallProps, 'renderTop' | 'renderBottom'>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'virtual-waterfall': ElementAttrs<TransformReact2VueType<VueVirtualWaterfallProps>>
    }
  }
}

export const VirtualWaterfall = Waterfall as unknown as VueComponentType<VueVirtualWaterfallProps>

function install (Vue: App) {
  Vue.component('virtual-waterfall', Waterfall)
}

export default {
  install
}
