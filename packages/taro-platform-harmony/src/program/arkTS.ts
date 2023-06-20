import { PACKAGE_NAME, PLATFORM_NAME } from '../utils'
import { TaroPlatformHarmony } from './harmony'

export default class Harmony extends TaroPlatformHarmony {
  platform = PLATFORM_NAME
  runtimePath: string[] | string = `${PACKAGE_NAME}/dist/runtime`
}
