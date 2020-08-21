import { Style } from '../dom/style'

export function getComputedStyle (element) {
  return new Style(element)
}
