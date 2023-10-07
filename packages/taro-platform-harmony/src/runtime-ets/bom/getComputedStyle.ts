import { TaroElement } from '../dom/element'

export function getComputedStyle (node: TaroElement) {
  return node._st
}
