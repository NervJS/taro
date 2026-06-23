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

import { document as taroDocument } from '@tarojs/runtime'

import type { TaroElement, TaroNode } from '@tarojs/runtime'

const SCROLLABLE_OVERFLOW = ['auto', 'scroll', 'overlay'] as const

/** 小程序端 scroll-view 的 nodeName（Taro 虚拟 DOM） */
const SCROLL_VIEW_NODE_NAME = 'scroll-view'

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
    parent = (parent as HTMLElement).parentElement
  }
  return null
}

/**
 * 小程序端：基于 Taro 虚拟 DOM 查找父级 scroll-view。
 * 从 contentId 对应节点沿 parentNode 向上遍历，找到 nodeName === 'scroll-view' 的节点。
 *
 * 仅用于小程序环境，H5 请使用 findScrollParent。
 *
 * @param contentId - content 节点的 id（需在 eventSource 中已注册）
 * @returns 找到的 TaroElement（scroll-view）或 null
 */
export function findScrollParentTaro (contentId: string): TaroElement | null {
  if (!contentId) return null
  const doc = taroDocument as { getElementById: (id: string) => TaroElement | null }
  const el = doc.getElementById?.(contentId)
  if (!el || !el.parentNode) return null

  let node: TaroNode | null = el
  while (node) {
    const parent = node.parentNode
    if (!parent) break
    // NodeType.ELEMENT_NODE === 1
    if (parent.nodeType === 1 && (parent as TaroElement).nodeName === SCROLL_VIEW_NODE_NAME) {
      return parent as TaroElement
    }
    node = parent
  }
  return null
}

