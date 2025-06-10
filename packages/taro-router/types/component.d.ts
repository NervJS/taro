/**
 * Note: @tarojs/router 不能依赖 @tarojs/components,
 *  因为 @tarojs/components 依赖 @tarojs/router，
 *  且仅通过 peerDependencies 引用依赖会在 pnpm publish 时抛出错误
 */
declare module '@tarojs/components/dist/components' {
  export function defineCustomElementTaroTabbar() {}

  export * from '@tarojs/components/dist/components'
}

