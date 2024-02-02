// Note: @tarojs/runtime 不依赖 @tarojs/taro, 所以不能改为从 @tarojs/taro 引入 (可能导致循环依赖)
export type TFunc = (...args: any[]) => any
export type PageConfig = Record<string, any>
