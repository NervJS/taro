import type { TaroElement } from '../dom/element'
import type { Style } from '../dom/style'

export function getComputedStyle (element: TaroElement): Style {
  return element.style
}
