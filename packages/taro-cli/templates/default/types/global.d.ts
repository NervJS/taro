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
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
    /** 当前构建的小程序 appid (在env文件中配置后可使用) */
    TARO_APP_ID: string;
  }
}

<%if (['vue', 'vue3'].includes(framework)) {-%>
declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3'
}<%}-%>
