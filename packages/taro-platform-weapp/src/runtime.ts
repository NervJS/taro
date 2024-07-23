import { mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { components, hostConfig } from './runtime-utils'

mergeReconciler(hostConfig)
mergeInternalComponents(components)
