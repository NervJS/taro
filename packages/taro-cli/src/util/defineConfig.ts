import type { IProjectConfig } from '@tarojs/taro/types/compile'
import type { CompilerTypes, CompilerWebpackTypes } from '@tarojs/taro/types/compile/compiler'

type WebpackMerge = (...configs: Array<object | null | undefined>) => object

export interface ConfigEnv {
  /** taro 当前执行的命令 */
  command: string
  /** 当前模式 (mode) */
  mode: string
}

export type UserConfigFn<T extends CompilerTypes = CompilerWebpackTypes> = (merge: WebpackMerge, env: ConfigEnv) => IProjectConfig<T> | Promise<IProjectConfig<T>>
export type UserConfigExport<T extends CompilerTypes = CompilerWebpackTypes> = IProjectConfig<T> | Promise<IProjectConfig<T>> | UserConfigFn

/**
 * @since v3.6.9
 * @warning 暂不支持 react native
 */
export function defineConfig<T extends CompilerTypes = CompilerWebpackTypes> (config: UserConfigExport<T>) {
  return config
}
