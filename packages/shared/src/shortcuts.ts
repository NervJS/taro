// 字符串简写
// 不要使用 const enum https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls
export const Shortcuts = {
  Container: 'container',
  Childnodes: 'cn',
  Text: 'v',
  NodeType: 'nt',
  NodeName: 'nn',

  // Attributes
  Sid: 'sid',
  Style: 'st',
  Class: 'cl',
  Src: 'src'
} as const

export type Shortcuts = typeof Shortcuts[keyof typeof Shortcuts]
