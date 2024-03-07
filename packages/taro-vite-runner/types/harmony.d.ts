import { VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'

declare module '@tarojs/taro/types/compile/viteCompilerContext' {
  interface VitePageMeta {
    entryOption?: Record<string, unknown>
  }
}
