interface ILoaderMeta {
  importFrameworkStatement: string
  mockAppStatement: string
  frameworkArgs: string
  creator: string
  creatorLocation: string
  extraImportForWeb: string
  execBeforeCreateWebApp: string
  importFrameworkName: string
  isNeedRawLoader?: boolean
  modifyConfig?: (config: Record<string, any>, source: string) => void
}

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
