import type { ValueOf } from './types'

// 字符串简写
export const Shortcuts = {
  Container: 'container',
  Childnodes: 'cn',
  Text: 'v',
  NodeType: 'nt',
  NodeName: 'nn',

  // Attrtibutes
  Sid: 'sid',
  Style: 'st',
  Class: 'cl',
  Src: 'src'
} as const

export type Shortcuts = ValueOf<typeof Shortcuts>;
