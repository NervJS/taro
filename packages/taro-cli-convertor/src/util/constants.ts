import type { ValueOf } from '@tarojs/shared'

export const Constants = {
  PLUGIN: 'plugin',
  PLUGIN_JSON: 'plugin.json',
} as const
export type Constants = ValueOf<typeof Constants>;
