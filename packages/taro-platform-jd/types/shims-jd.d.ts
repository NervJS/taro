import '@tarojs/components/types/WebView'

declare module '@tarojs/components/types/WebView' {
  interface WebViewProps {
    /** 容器高度
     * @supported jd
     * @note IDE 可能会不生效，请在真机环境中验证
     */
    height?: number
  }
}
