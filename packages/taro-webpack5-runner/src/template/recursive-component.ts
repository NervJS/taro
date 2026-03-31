/* eslint-disable no-undef */
import { createRecursiveComponentConfig, document as taroDocumentProvider } from '@tarojs/runtime'

function registerRecursiveComponent (componentName) {
  // 显式依赖 runtime.document，避免独立 recursive-component bundle 中 document 初始化被摇树优化掉
  if (typeof taroDocumentProvider.getElementById !== 'function') {
    throw new Error('Taro runtime document is not initialized')
  }
  // @ts-ignore
  Component(createRecursiveComponentConfig(componentName))
}

globalThis.__taroRegisterRecursiveComponent = registerRecursiveComponent
