interface ILoaderMeta {
  importFrameworkStatement: string
  mockAppStatement: string
  frameworkArgs: string
  creator: string
  creatorLocation: string
  importFrameworkName: string
  extraImportForWeb: string
  execBeforeCreateWebApp: string
  isNeedRawLoader?: boolean
  modifyConfig?: (config: Record<string, any>, source: string) => void
}

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
