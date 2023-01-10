/* eslint-disable import/export */
// TODO 根据 framework 导出组件适配器或注册 web-components 组件 （验证 tree-shaking 特性）

// useHtmlComponents 为 true 时，使用 html-components 组件，否则使用 taro-components 组件
// 提供部分组件注册逻辑
export * from '@tarojs/components/lib/react'
