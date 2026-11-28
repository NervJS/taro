import type {
  AddPageChunks,
  CommonBuildConfig as BaseCommonBuildConfig,
  IChain,
  IComponent,
  IComponentObj,
  IFileType,
  IH5BuildConfig as BaseH5BuildConfig,
  IHarmonyBuildConfig as BaseHarmonyBuildConfig,
  IMiniBuildConfig as BaseMiniBuildConfig,
  IOption
} from '@tarojs/runner-utils/bundler/types'
import type Webpack from 'webpack'

export type { AddPageChunks, IChain, IComponent, IComponentObj, IFileType, IOption }

export type CommonBuildConfig = BaseCommonBuildConfig<Webpack.EntryObject>
export type IMiniBuildConfig = BaseMiniBuildConfig<Webpack.EntryObject>
export type IH5BuildConfig = BaseH5BuildConfig<Webpack.EntryObject>
export type IHarmonyBuildConfig = BaseHarmonyBuildConfig<Webpack.EntryObject>
