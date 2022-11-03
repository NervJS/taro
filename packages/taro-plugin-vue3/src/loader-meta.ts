interface ILoaderMeta {
  importFrameworkStatement: string
  mockAppStatement: string
  frameworkArgs: string
  creator: string
  creatorLocation: string
  importFrameworkName: string
  isNeedRawLoader?: boolean
  extraImportForWeb?: string
  execBeforeCreateWebApp?: string
  compatComponentImport?: string
  compatComponentExtra?: string
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
    extraImportForWeb: `
import { initVue3Components } from '@tarojs/components/dist/vue3'
`,
    execBeforeCreateWebApp: `
initVue3Components(component)
`
  }
}
