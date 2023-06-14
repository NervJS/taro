
import type { IProjectConfig } from '@tarojs/taro/types/compile'

type WebpackMerge = (...configs: Array<object | null | undefined>) => object


export interface ConfigEnv {
  command: string
  mode: string
}

export type UserConfigFn = (mergin: WebpackMerge, env: ConfigEnv) => IProjectConfig | Promise<IProjectConfig>
export type UserConfigExport = IProjectConfig | Promise<IProjectConfig> | UserConfigFn

export function defineConfig (config: UserConfigExport) {
  return () => config
}