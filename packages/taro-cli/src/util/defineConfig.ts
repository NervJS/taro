import type { IProjectConfig } from '@tarojs/taro/types/compile'

type WebpackMerge = (...configs: Array<object | null | undefined>) => object

export interface ConfigEnv {
  /** taro 当前执行的命令 */
  command: string
  /** 当前模式 (mode) */
  mode: string
}

export type UserConfigFn = (mergin: WebpackMerge, env: ConfigEnv) => IProjectConfig | Promise<IProjectConfig>
export type UserConfigExport = IProjectConfig | Promise<IProjectConfig> | UserConfigFn

/**
 * @since v3.6.9
 * @warning 暂不支持 react native
 */
export function defineConfig (config: UserConfigExport) {
  return config
}
