import './style/index.scss'

import { ScrollView, View } from '@tarojs/components'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import ListItem from './ListItem'
import StickyHeader from './StickyHeader'
import StickySection from './StickySection'

export interface ListProps {
  showScrollbar?: boolean
  scrollTop?: number
  onScroll?: (e: { scrollTop: number, scrollLeft: number }) => void
  onScrollToUpper?: () => void
  onScrollToLower?: () => void
  upperThresholdCount?: number
  lowerThresholdCount?: number
  cacheCount?: number
  stickyHeader?: boolean
  space?: number
  item?: React.ComponentType<any>
  itemCount?: number
  itemData?: any[]
  itemSize?: number | ((index: number, data?: any[]) => number)
  height?: number | string
  width?: number | string
  layout?: 'vertical' | 'horizontal'
  style?: React.CSSProperties
  children?: React.ReactNode
  headerHeight?: number // 纵向 header 高度
  headerWidth?: number // 横向 header 宽度
  itemHeight?: number // 纵向 item 高度
  itemWidth?: number // 横向 item 宽度
}

// 工具：累加数组
function accumulate(arr: number[]) {
  const result = [0]
  for (let i = 0; i < arr.length; i++) {
    result[i + 1] = result[i] + arr[i]
  }
  return result
}

const List: React.FC<ListProps> = (props) => {
  const {
    stickyHeader = false,
    space = 0,
    height = 400,
    width = '100%',
    showScrollbar = true,
    scrollTop: controlledScrollTop,
    onScroll,
    onScrollToUpper,
    onScrollToLower,
    upperThresholdCount = 0,
    lowerThresholdCount = 0,
    cacheCount = 2,
    style,
    children,
    layout = 'vertical'
  } = props

  const isHorizontal = layout === 'horizontal'
  const DEFAULT_ITEM_WIDTH = 120
  const DEFAULT_ITEM_HEIGHT = 40

  // refs for dynamic measurement
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // 滚动状态
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(controlledScrollTop ?? 0)
  const [containerLength] = useState<number>(typeof (isHorizontal ? width : height) === 'number' ? (isHorizontal ? (width as number) : (height as number)) : 400)

  // 解析分组结构，只支持 StickySection 和 ListItem 作为直接子组件
  const sections = useMemo(() => {
    const result: Array<{
      header: React.ReactElement | null
      items: React.ReactElement[]
      key: string
    }> = []
    const defaultItems: React.ReactElement[] = []
    React.Children.forEach(children, (child, idx) => {
      if (React.isValidElement(child) && child.type === StickySection) {
        // 分组模式
        const sectionProps = child.props as any
        let header: React.ReactElement | null = null
        const items: React.ReactElement[] = []
        React.Children.forEach(sectionProps.children, (subChild) => {
          if (React.isValidElement(subChild) && subChild.type === StickyHeader) header = subChild
          else if (React.isValidElement(subChild) && subChild.type === ListItem) items.push(subChild)
        })
        result.push({ header, items, key: child.key || String(idx) })
      } else if (React.isValidElement(child) && child.type === ListItem) {
        // 普通 ListItem
        defaultItems.push(child)
      }
    })
    if (defaultItems.length > 0) {
      result.push({ header: null, items: defaultItems, key: 'default' })
    }
    return result
  }, [children])

  // 工具：获取 header 尺寸，确保所有 header 相关逻辑一致
  const getHeaderSize = () => {
    if (isHorizontal) {
      if (typeof props.headerWidth === 'number') return props.headerWidth
      if (typeof props.itemWidth === 'number') return props.itemWidth
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(0, props.itemData) || DEFAULT_ITEM_WIDTH
      return DEFAULT_ITEM_WIDTH
    } else {
      if (typeof props.headerHeight === 'number') return props.headerHeight
      if (typeof props.itemHeight === 'number') return props.itemHeight
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(0, props.itemData) || DEFAULT_ITEM_HEIGHT
      return DEFAULT_ITEM_HEIGHT
    }
  }

  // 工具：获取 item 尺寸，支持函数/props/默认值
  const getItemSize = (index: number) => {
    if (isHorizontal) {
      if (typeof props.itemWidth === 'number') return props.itemWidth
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(index, props.itemData) || DEFAULT_ITEM_WIDTH
      return DEFAULT_ITEM_WIDTH
    } else {
      if (typeof props.itemHeight === 'number') return props.itemHeight
      if (typeof props.itemSize === 'number') return props.itemSize
      if (typeof props.itemSize === 'function') return props.itemSize(index, props.itemData) || DEFAULT_ITEM_HEIGHT
      return DEFAULT_ITEM_HEIGHT
    }
  }

  // 计算分组累积高度/宽度
  const sectionOffsets = useMemo(() => {
    const offsets: number[] = [0]
    sections.forEach((section) => {
      const headerSize = getHeaderSize()
      const itemSizes = section.items.map((_, i) => getItemSize(i))
      const groupSize = (section.header ? headerSize : 0) +
        itemSizes.reduce((a, b) => a + b, 0) +
        Math.max(0, section.items.length) * space
      offsets.push(offsets[offsets.length - 1] + groupSize)
    })
    return offsets
  }, [sections, space, isHorizontal, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData])

  // 外层虚拟滚动：可见分组
  const [startSection, endSection] = useMemo(() => {
    let start = 0; let end = sections.length - 1
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i + 1] > scrollOffset) {
        start = Math.max(0, i - cacheCount)
        break
      }
    }
    for (let i = start; i < sections.length; i++) {
      if (sectionOffsets[i] >= scrollOffset + containerLength) {
        end = Math.min(sections.length - 1, i + cacheCount)
        break
      }
    }
    return [start, end]
  }, [scrollOffset, containerLength, sectionOffsets, sections.length, cacheCount])

  // 触顶/触底事件
  useEffect(() => {
    if (onScrollToUpper && scrollOffset <= (upperThresholdCount > 0 ? sectionOffsets[upperThresholdCount] : 0)) {
      onScrollToUpper()
    }
    if (onScrollToLower && scrollOffset + containerLength >= sectionOffsets[sectionOffsets.length - 1] - (lowerThresholdCount > 0 ? sectionOffsets[sectionOffsets.length - 1] - sectionOffsets[sections.length - lowerThresholdCount] : 0)) {
      onScrollToLower()
    }
  }, [scrollOffset, containerLength, sectionOffsets, sections.length, upperThresholdCount, lowerThresholdCount, onScrollToUpper, onScrollToLower])

  // 受控滚动同步
  useEffect(() => {
    if (typeof controlledScrollTop === 'number') setScrollOffset(controlledScrollTop)
    if (typeof controlledScrollTop === 'number' && containerRef.current) {
      if (isHorizontal) {
        containerRef.current.scrollLeft = controlledScrollTop
      } else {
        containerRef.current.scrollTop = controlledScrollTop
      }
    }
  }, [controlledScrollTop, isHorizontal])

  // 容器样式
  const containerStyle: React.CSSProperties = {
    height: isHorizontal ? width : height,
    width: isHorizontal ? height : width,
    ...style,
  }

  // ScrollView 属性
  const scrollViewProps: any = {
    scrollY: !isHorizontal,
    scrollX: isHorizontal,
    style: containerStyle,
    scrollTop: !isHorizontal ? scrollOffset : undefined,
    scrollLeft: isHorizontal ? scrollOffset : undefined,
    enhanced: true,
    showScrollbar: showScrollbar,
    onScroll: (e: any) => {
      const newOffset = isHorizontal ? e.detail.scrollLeft : e.detail.scrollTop
      setScrollOffset(newOffset)
      onScroll?.({ scrollTop: isHorizontal ? 0 : newOffset, scrollLeft: isHorizontal ? newOffset : 0 })
    },
    onScrollToUpper,
    onScrollToLower,
  }

  // 总高度/宽度
  const totalLength = sectionOffsets[sectionOffsets.length - 1]

  // 吸顶/吸左 header
  const stickyHeaderNode = useMemo(() => {
    if (!stickyHeader) return null
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i] <= scrollOffset && scrollOffset < sectionOffsets[i + 1]) {
        const section = sections[i]
        if (section.header) {
          const headerSize = getHeaderSize()
          return (
            <View className="taro-list-sticky-header" style={isHorizontal ? { width: headerSize } : { height: headerSize }}>
              {section.header}
            </View>
          )
        }
      }
    }
    return null
  }, [stickyHeader, scrollOffset, sectionOffsets, sections, isHorizontal, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData])

  // 渲染分组+item双层虚拟滚动
  const renderSections = () => {
    const nodes: React.ReactNode[] = []
    let offset = sectionOffsets[startSection]
    for (let s = startSection; s <= endSection; s++) {
      const section = sections[s]
      const headerSize = getHeaderSize()
      const itemSizes = section.items.map((_, i) => getItemSize(i))
      // header
      if (section.header) {
        nodes.push(
          React.createElement('div', {
            key: section.key + '-header' + '-' + layout,
            ref: (el: HTMLDivElement | null) => { headerRefs.current[section.key] = el },
            className: isHorizontal ? 'taro-list-section-header horizontal' : 'taro-list-section-header',
            style: isHorizontal ? { left: offset, width: headerSize } : { top: offset, height: headerSize },
          }, section.header)
        )
        offset += headerSize
      }
      // item offsets
      const itemOffsets = accumulate(itemSizes.map((size) => size + space))
      // 内层虚拟滚动：可见item区间
      let startItem = 0; let endItem = section.items.length - 1
      for (let i = 0; i < section.items.length; i++) {
        if (offset + itemOffsets[i + 1] > scrollOffset) {
          startItem = Math.max(0, i - cacheCount)
          break
        }
      }
      for (let i = startItem; i < section.items.length; i++) {
        if (offset + itemOffsets[i] >= scrollOffset + containerLength) {
          endItem = Math.min(section.items.length - 1, i + cacheCount)
          break
        }
      }
      // 渲染可见item
      for (let i = startItem; i <= endItem; i++) {
        nodes.push(
          React.createElement('div', {
            key: section.key + '-item-' + i + '-' + layout,
            ref: (el: HTMLDivElement | null) => { itemRefs.current[`${section.key}-${i}`] = el },
            className: isHorizontal ? 'taro-list-section-item horizontal' : 'taro-list-section-item',
            style: isHorizontal
              ? {
                left: offset + itemOffsets[i],
                width: itemSizes[i],
                marginRight: space,
              }
              : {
                top: offset + itemOffsets[i],
                height: itemSizes[i],
                marginBottom: space,
              },
          }, section.items[i])
        )
      }
      offset += itemOffsets[itemOffsets.length - 1]
    }
    return nodes
  }

  return (
    <ScrollView ref={containerRef} className="taro-list-container" {...scrollViewProps}>
      <View style={isHorizontal ? { width: totalLength, position: 'relative', height: '100%' } : { height: totalLength, position: 'relative', width: '100%' }}>
        {stickyHeaderNode}
        {renderSections()}
      </View>
    </ScrollView>
  )
}

export default List

