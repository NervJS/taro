import { mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { components, hostConfig } from './runtime-utils'

mergeReconciler(hostConfig)
const internalComponents = mergeInternalComponents(components)
delete internalComponents.Input.cursor
delete internalComponents.Input['selection-start']
delete internalComponents.Input['selection-end']
