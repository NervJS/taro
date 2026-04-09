import Taro from '@tarojs/taro'
import { useCallback, useEffect, useRef } from 'react'

import { createSelectorQueryScoped, getMiniProgramObserverScope, isH5, isMiniProgram } from '../utils'

/**
 * useResizeObserver Hook - 尺寸变化监听（平台适配）
 *
 * H5: 使用 ResizeObserver API
 * 小程序: 使用 IntersectionObserver + SelectorQuery
 */

interface UseResizeObserverOptions {
  /** 是否启用监听 */
  enabled: boolean

  /** 是否水平滚动（监听 width 还是 height） */
  isHorizontal: boolean

  /** List 容器 ID（小程序用于 SelectorQuery） */
  listId: string
  selectorQueryScope?: object

  /** 尺寸变化回调 */
  onResize: (index: number, size: number) => void
}

interface UseResizeObserverReturn {
  /** 观察指定元素（传入 ref 和索引） */
  observe: (element: HTMLElement | null, index: number) => void

  /** 取消观察指定元素 */
  unobserve: (element: HTMLElement | null) => void

  /** 断开所有观察 */
  disconnect: () => void
}

export function useResizeObserver(
  options: UseResizeObserverOptions
): UseResizeObserverReturn {
  const { enabled, isHorizontal, listId, onResize, selectorQueryScope } = options

  // H5: ResizeObserver 实例
  const observerRef = useRef<ResizeObserver | null>(null)

  // 小程序: IntersectionObserver 实例 Map
  const intersectionObserversRef = useRef<Map<number, Taro.IntersectionObserver>>(new Map())

  // 已观察的元素 Map（用于去重）
  const observedElementsRef = useRef<Map<number, HTMLElement | null>>(new Map())

  /**
   * H5 实现：使用 ResizeObserver
   */
  const observeH5 = useCallback((element: HTMLElement | null, index: number) => {
    if (!element || !enabled) return

    // 避免重复观察
    if (observedElementsRef.current.has(index)) return

    // 创建 ResizeObserver（懒加载）
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-index'))
          if (isNaN(idx)) return

          const size = isHorizontal
            ? entry.contentRect.width
            : entry.contentRect.height

          onResize(idx, size)
        })
      })
    }

    // 设置 data-index 属性
    element.setAttribute('data-index', String(index))

    // 开始观察
    observerRef.current.observe(element)
    observedElementsRef.current.set(index, element)
  }, [enabled, isHorizontal, onResize])

  /**
   * 小程序实现：使用 IntersectionObserver + SelectorQuery
   * 使用唯一 id 选择器，避免多 List 并存时误命中（index>=0 为 item，index<0 为 header）
   * 使用 Taro.nextTick 延后 observe，确保 setData 已提交、节点已挂载，避免 "Node is not found" 报错
   */
  const observeMiniProgram = useCallback((_element: any, index: number) => {
    if (!enabled) return

    // 避免重复观察
    if (intersectionObserversRef.current.has(index)) return

    const selector = index >= 0
      ? `#${listId}-list-item-inner-${index}`
      : `#${listId}-list-header-inner-${-index - 1}`

    const doObserve = () => {
      try {
        const observerScope = getMiniProgramObserverScope(selectorQueryScope)
        const observer = Taro.createIntersectionObserver(observerScope, {
          observeAll: true
        })

        // 相对于 List 容器
        observer.relativeTo(`#${listId}`)

        // 观察元素进入可见区域（唯一 id 避免跨 List 误命中）
        observer.observe(selector, (res) => {
          if (res.intersectionRatio > 0) {
            createSelectorQueryScoped(selectorQueryScope)
              .select(selector)
              .boundingClientRect((rect: any) => {
                if (rect) {
                  const size = isHorizontal ? rect.width : rect.height
                  onResize(index, size)
                }
              })
              .exec()
          }
        })

        intersectionObserversRef.current.set(index, observer)
      } catch {
        // ignore observe failure
      }
    }

    Taro.nextTick(doObserve)
  }, [enabled, isHorizontal, listId, onResize, selectorQueryScope])

  /**
   * 观察元素（平台自动适配）
   */
  const observe = useCallback((element: HTMLElement | null, index: number) => {
    if (!enabled) return

    if (isH5) {
      observeH5(element, index)
    } else if (isMiniProgram) {
      observeMiniProgram(element, index)
    }
  }, [enabled, observeH5, observeMiniProgram])

  /**
   * 取消观察元素
   */
  const unobserve = useCallback((element: HTMLElement | null) => {
    if (!element) return

    const index = Number(element.getAttribute('data-index'))
    if (isNaN(index)) return

    if (isH5 && observerRef.current) {
      observerRef.current.unobserve(element)
      observedElementsRef.current.delete(index)
    } else if (isMiniProgram) {
      const observer = intersectionObserversRef.current.get(index)
      if (observer) {
        observer.disconnect()
        intersectionObserversRef.current.delete(index)
      }
    }
  }, [])

  /**
   * 断开所有观察
   */
  const disconnect = useCallback(() => {
    if (isH5 && observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
      observedElementsRef.current.clear()
    } else if (isMiniProgram) {
      intersectionObserversRef.current.forEach((observer) => {
        observer.disconnect()
      })
      intersectionObserversRef.current.clear()
    }
  }, [])

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    observe,
    unobserve,
    disconnect
  }
}
