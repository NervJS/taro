/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

<%if (['vue', 'vue3'].includes(framework)) {-%>
declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3'
}
declare module '@vue/runtime-core' {
  export interface GlobalComponents extends JSX.IntrinsicElements {
    /** Note: Vue 在 runtime 中将 JSX.IntrinsicElements 通过 index signature 重复声明标签
     * 这会导致插件无法正常跳转类型，可以手动覆盖声明标签活得更好的体验，参考如下：
     * 'scroll-view': JSX.IntrinsicElements['scroll-view']
     */
  }
}<%}-%>
