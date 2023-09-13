import { fs } from '@tarojs/helper'

import { appendVirtualModulePrefix } from '../utils'
import { TaroCompiler } from '../utils/compiler/h5'

import type { PluginOption } from 'vite'

const ENTRY_SUFFIX = '?entry-html=true'

export default function (compiler): PluginOption {
  return {
    name: 'taro:vite-h5-pipeline',
    enforce: 'pre',
    // async buildStart () {
    //   // const source = await (await fs.readFile('/Users/liuzejia/test/taro-react-vite/src/index.html')).toString()
    //   debugger
    //   this.emitFile({
    //     type: 'chunk',
    //     id : 'src/pages/answer1/index.html'
    //   })
      
    // },
    // async generateBundle() {
    //   debugger
    // }
    async resolveId (source, importer, options) {
      if (source === '/Users/liuzejia/test/taro-react-vite/src/index3.html') return '/Users/liuzejia/test/taro-react-vite/src/index3.html'
    },
    async load (id) {
      const source = await (await fs.readFile('/Users/liuzejia/test/taro-react-vite/src/index.html')).toString()
      debugger
      if (id === '/Users/liuzejia/test/taro-react-vite/src/index3.html') return source
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html, ctx) {
        debugger
       
      } 
    },

  }
}