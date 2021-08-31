export const frameworkMeta: Record<string, {
  importFrameworkStatement: string
  mockAppStatement: string
  frameworkArgs: string
  creator: string
  importFrameworkName: string
  isNeedRawLoader?: boolean
  extraImportForWeb?: string
  execBeforeCreateWebApp?: string
  compatComponentImport?: string
  compatComponentExtra?: string
}> = {
  vue3: {
    importFrameworkStatement: `
import { h, createApp } from 'vue'
`,
    mockAppStatement: `
const App = createApp({})
`,
    frameworkArgs: 'h, config',
    creator: 'createVue3App',
    importFrameworkName: 'h',
    isNeedRawLoader: true,
    extraImportForWeb: `
import { initVue3Components } from '@tarojs/components/dist-h5/vue3'
`,
    execBeforeCreateWebApp: `
initVue3Components(component)
`
  }
}
