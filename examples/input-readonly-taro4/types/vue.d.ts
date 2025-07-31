export {}

declare module 'vue' {
  export interface GlobalComponents extends JSX.IntrinsicElements {
    /** Note: Vue 在 runtime 中将 JSX.IntrinsicElements 通过 index signature 重复声明标签
     * 这会导致插件无法正常跳转类型，可以手动覆盖声明标签活得更好的体验，参考如下：
     * 'scroll-view': JSX.IntrinsicElements['scroll-view']
     */
  }
}
