import { TaroElement } from '../dom/element/element'

export function getComputedStyle (node: TaroElement) {
  return node._st
}
