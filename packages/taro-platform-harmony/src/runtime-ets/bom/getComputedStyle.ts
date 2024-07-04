import type { TGetComputedStyle } from '@tarojs/runtime/dist/bom/getComputedStyle'

export function getComputedStyle (node: Parameters<TGetComputedStyle>[0]) {
  // @ts-ignore
  return node._st
}
