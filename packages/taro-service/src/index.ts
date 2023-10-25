import Config from './Config'
import Kernel from './Kernel'
import { TaroPlatformBase, TaroPlatformWeb } from './platform-plugin-base'

export * from './utils/types'
export { Config, Kernel, TaroPlatformBase, TaroPlatformWeb }
export default { Config, Kernel, TaroPlatformBase, TaroPlatformWeb }

export type { IPluginContext } from './utils/types'
