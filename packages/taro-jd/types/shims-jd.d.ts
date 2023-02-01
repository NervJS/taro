import '@tarojs/components/types/WebView'

declare module '@tarojs/components/types/WebView' {
  interface WebViewProps {
    /** 容器高度
     * @supported jd
     */
    height?: number;
  }
}