interface WebSocket { }
interface TextMetrics { }
interface CanvasGradient { }
interface CanvasGradient { }

declare module '*.png' {
  const value: any
  export default value
}
// 定义使用到的DOM类型；DOM类型定义与react-native有冲突
declare interface HTMLMediaElement {}

declare interface File {}

declare interface MediaTrackSettings {}

declare const global: any
