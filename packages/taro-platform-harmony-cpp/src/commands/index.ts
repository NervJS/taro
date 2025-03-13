import registerCacheCommand from './cache'

import type { IPluginContext } from '@tarojs/service'
import type { IOptions } from '../index'

export default function initCommands(ctx: IPluginContext, _options: IOptions = {}): void {
  registerCacheCommand(ctx)
}
