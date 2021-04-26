import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { hostConfig, components } from './runtime-utils'

mergeReconciler(hostConfig)
mergeInternalComponents(components)
