/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
