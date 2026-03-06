/**
 * 查找元素的真实滚动父节点。
 * 用于 nestedScroll 模式下无 props/Context 时自动获取 scrollElement。
 *
 * 策略：
 * 1. 优先命中 Taro ScrollView 类名 .taro-scroll
 * 2. 回退：向上遍历找通用可滚动祖先
 *
 * 严格条件（均需满足）：
 * - overflow 为 auto | scroll | overlay
 * - scrollHeight > clientHeight（纵向）或 scrollWidth > clientWidth（横向）
 * - 在 document.body 前停止
 */

const SCROLLABLE_OVERFLOW = ['auto', 'scroll', 'overlay'] as const

/**
 * 判断元素是否可滚动（严格：overflow 可滚动 + 实际有溢出）
 */
export function isScrollableElement(
  el: HTMLElement | null,
  vertical = true
): el is HTMLElement {
  if (!el || el === document.body) return false
  const style = getComputedStyle(el)
  const overflow = vertical ? style.overflowY : style.overflowX
  if (!SCROLLABLE_OVERFLOW.includes(overflow as any)) return false
  const hasOverflow = vertical
    ? el.scrollHeight > el.clientHeight
    : el.scrollWidth > el.clientWidth
  return hasOverflow
}

/**
 * 从给定元素向上查找最近的滚动父节点。
 * 优先匹配 .taro-scroll，未命中则按通用可滚动条件查找。
 */
export function findScrollParent(
  el: HTMLElement | null,
  vertical = true
): HTMLElement | null {
  if (!el) return null

  // 1. 优先：Taro ScrollView 的 div（.taro-scroll）
  const taroScroll = el.closest?.('.taro-scroll')
  if (taroScroll && taroScroll !== document.body && isScrollableElement(taroScroll as HTMLElement, vertical)) {
    return taroScroll as HTMLElement
  }

  // 2. 回退：通用可滚动祖先
  let parent: HTMLElement | null = el.parentElement
  while (parent !== null && parent !== document.body) {
    if (isScrollableElement(parent, vertical)) return parent
    const next = parent.parentElement
    parent = next
  }
  return null
}

