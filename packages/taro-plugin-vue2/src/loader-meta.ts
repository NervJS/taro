import type { ILoaderMeta } from '@tarojs/taro/types/compile/config/plugin'

export function getLoaderMeta (): ILoaderMeta {
  return {
    importFrameworkStatement: `
import Vue from 'vue';
`,
    mockAppStatement: `
const App = {
  render (h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}
`,
    frameworkArgs: 'Vue, config',
    creator: 'createVueApp',
    creatorLocation: '@tarojs/plugin-framework-vue2/dist/runtime',
    importFrameworkName: 'Vue',
    isNeedRawLoader: true,
    extraImportForWeb: '',
    execBeforeCreateWebApp: '',
  }
}
