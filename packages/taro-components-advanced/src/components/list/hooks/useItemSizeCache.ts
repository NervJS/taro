import { useCallback, useRef } from 'react'

/**
 * useItemSizeCache Hook - 动态尺寸缓存管理
 *
 * 支持垂直滚动（高度）和水平滚动（宽度）两种模式
 */

/** 单个项的尺寸缓存 */
interface ItemMeasureCache {
  measuredSize: number | null // 实际测量尺寸
  estimatedSize: number // 估算尺寸
  isMeasured: boolean // 是否已测量
}

interface UseItemSizeCacheOptions {
  isHorizontal: boolean // 是否水平滚动
  estimatedSize: number // 估算尺寸
  itemCount: number // 项总数
}

interface UseItemSizeCacheReturn {
  /** 获取项的尺寸（高度或宽度） */
  getItemSize: (index: number) => number

  /** 设置项的尺寸 */
  setItemSize: (index: number, size: number) => void
}

export function useItemSizeCache(
  options: UseItemSizeCacheOptions
): UseItemSizeCacheReturn {
  const { estimatedSize } = options

  // 缓存 Map：key = 索引，value = 尺寸信息
  const cacheRef = useRef<Map<number, ItemMeasureCache>>(new Map())

  /**
   * 获取项的尺寸
   * 优先返回实际测量值，否则返回估算值
   */
  const getItemSize = useCallback((index: number): number => {
    const cached = cacheRef.current.get(index)

    if (cached?.isMeasured && cached.measuredSize !== null) {
      return cached.measuredSize
    }

    return estimatedSize
  }, [estimatedSize])

  /**
   * 设置项的尺寸（实际测量后调用）
   */
  const setItemSize = useCallback((index: number, size: number) => {
    const cached = cacheRef.current.get(index)

    // 尺寸变化小于 1px，忽略（避免微小抖动）
    if (cached?.measuredSize && Math.abs(cached.measuredSize - size) < 1) {
      return
    }

    cacheRef.current.set(index, {
      measuredSize: size,
      estimatedSize,
      isMeasured: true
    })
  }, [estimatedSize])

  return {
    getItemSize,
    setItemSize
  }
}
