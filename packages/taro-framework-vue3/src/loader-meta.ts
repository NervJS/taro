import type { ILoaderMeta } from '@tarojs/taro/types/compile/config/plugin'

export function getLoaderMeta (): ILoaderMeta {
  return {
    importFrameworkStatement: `
import { h, createApp } from 'vue'
`,
    mockAppStatement: `
const App = createApp({})
`,
    frameworkArgs: 'h, config',
    creator: 'createVue3App',
    creatorLocation: '@tarojs/plugin-framework-vue3/dist/runtime',
    importFrameworkName: 'h',
    isNeedRawLoader: true,
    extraImportForWeb: '',
    execBeforeCreateWebApp: '',
  }
}
