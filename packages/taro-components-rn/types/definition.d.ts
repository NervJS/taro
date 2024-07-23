// import * as ReactNative from 'react-native';

// declare module 'react-native' {
//   interface ARTStatic {
//     Transform: any;
//   }
// }


// 修复第三方库的类型定义依赖DOM，但是DOM与react-native类型冲突
// begin
declare interface Touch {}

declare interface HTMLMediaElement {}

declare interface MediaTrackSettings {}
// end


declare const global: {
  _taroCamera
}

declare module '*.png' {
  const value: any
  export default value
}