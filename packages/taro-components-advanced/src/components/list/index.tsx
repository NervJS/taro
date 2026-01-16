import { ScrollView, View } from '@tarojs/components'
import React from 'react'

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
export function accumulate(arr: number[]) {
  const result = [0]
  for (let i = 0; i < arr.length; i++) {
    result[i + 1] = result[i] + arr[i]
  }
  return result
}

// 检测抖动
export function isShaking(diffList: number[]): boolean {
  if (diffList.length < 3) return false

  // 检查是否有连续的正负交替
  const signs = diffList.map(diff => Math.sign(diff))
  let alternations = 0
  for (let i = 1; i < signs.length; i++) {
    if (signs[i] !== 0 && signs[i] !== signs[i - 1]) {
      alternations++
    }
  }

  // 如果交替次数过多，认为是抖动
  return alternations >= 2
}

const List: React.FC<ListProps> = (props) => {
  const isH5 = process.env.TARO_ENV === 'h5'
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

  // 滚动状态管理
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 渲染偏移量 - 用于计算应该渲染哪些元素
  const [renderOffset, setRenderOffset] = React.useState(controlledScrollTop ?? 0)

  // 滚动视图偏移量 - 只在滚动结束或明确请求时更新到ScrollView
  const [scrollViewOffset, setScrollViewOffset] = React.useState(controlledScrollTop ?? 0)


  const [containerLength] = React.useState<number>(typeof (isHorizontal ? width : height) === 'number' ? (isHorizontal ? (width as number) : (height as number)) : 400)

  // 滚动追踪相关refs
  const isScrollingRef = React.useRef(false)
  const lastScrollTopRef = React.useRef(controlledScrollTop ?? 0)
  const scrollDiffListRef = React.useRef<number[]>([0, 0, 0])
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // 解析分组结构，只支持 StickySection 和 ListItem 作为直接子组件
  const sections = React.useMemo(() => {
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
  const sectionOffsets = React.useMemo(() => {
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
  const [startSection, endSection] = React.useMemo(() => {
    let start = 0; let end = sections.length - 1
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i + 1] > renderOffset) {
        start = Math.max(0, i - cacheCount)
        break
      }
    }
    for (let i = start; i < sections.length; i++) {
      if (sectionOffsets[i] >= renderOffset + containerLength) {
        end = Math.min(sections.length - 1, i + cacheCount)
        break
      }
    }
    return [start, end]
  }, [renderOffset, containerLength, sectionOffsets, sections.length, cacheCount])

  // 触顶/触底事件
  React.useEffect(() => {
    if (onScrollToUpper && renderOffset <= (upperThresholdCount > 0 ? sectionOffsets[upperThresholdCount] : 0)) {
      onScrollToUpper()
    }
    if (onScrollToLower && renderOffset + containerLength >= sectionOffsets[sectionOffsets.length - 1] - (lowerThresholdCount > 0 ? sectionOffsets[sectionOffsets.length - 1] - sectionOffsets[sections.length - lowerThresholdCount] : 0)) {
      onScrollToLower()
    }
  }, [renderOffset, containerLength, sectionOffsets, sections.length, upperThresholdCount, lowerThresholdCount, onScrollToUpper, onScrollToLower])

  // 处理渲染偏移量更新
  const updateRenderOffset = React.useCallback((newOffset: number) => {
    lastScrollTopRef.current = newOffset
    isScrollingRef.current = true

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    setRenderOffset(newOffset) // 立即更新渲染偏移量

    // 平台适配：微信小程序使用延时，其他平台立即更新
    const isWeapp = process.env.TARO_ENV === 'weapp'
    if (isWeapp) {
      // 微信小程序：使用延时避免抖动
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        setScrollViewOffset(newOffset) // 滚动结束后，同步滚动视图偏移量
      }, 200)
    } else {
      // 其他平台：立即更新以获得更好的响应性
      setScrollViewOffset(newOffset) // 立即更新滚动视图偏移量
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 200)
    }
  }, [])



  // 智能滚动处理函数
  const handleScroll = React.useCallback((e: any) => {
    // 兼容Stencil版本和React版本的事件结构
    let newOffset: number
    if (e.detail) {
      // React版本的事件结构
      newOffset = isHorizontal ? e.detail.scrollLeft : e.detail.scrollTop
    } else {
      // Stencil版本的事件结构
      newOffset = isHorizontal ? e.scrollLeft : e.scrollTop
    }

    const diff = newOffset - lastScrollTopRef.current
    scrollDiffListRef.current.shift()
    scrollDiffListRef.current.push(diff)

    // 只保留抖动检测，移除方向检测
    if (isScrollingRef.current && isShaking(scrollDiffListRef.current)) {
      return
    }

    updateRenderOffset(newOffset) // 直接更新渲染偏移量

    onScroll?.({
      scrollTop: isHorizontal ? 0 : newOffset,
      scrollLeft: isHorizontal ? newOffset : 0
    })
  }, [isHorizontal, onScroll, updateRenderOffset, containerLength])

  // 初始化后的延迟同步 - 确保ScrollView正确设置初始位置
  React.useEffect(() => {
    if (typeof controlledScrollTop === 'number') {
      setScrollViewOffset(controlledScrollTop)
      lastScrollTopRef.current = controlledScrollTop
    }
  }, [controlledScrollTop])

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // 容器样式
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    height: isHorizontal ? width : height,
    width: isHorizontal ? height : width,
    ...style,
  }

  // 修改ScrollView组件的props，添加data-testid属性
  // ScrollView 属性
  const scrollViewProps: any = {
    scrollY: !isHorizontal,
    scrollX: isHorizontal,
    style: containerStyle,
    enhanced: true,
    showScrollbar: showScrollbar,
    onScroll: handleScroll,
    onScrollToUpper,
    onScrollToLower,
    'data-testid': 'taro-list-container'
  }

  // 设置ScrollView的滚动位置 - 同时兼容React版本和Stencil版本
  if (isHorizontal) {
    scrollViewProps.scrollLeft = scrollViewOffset // React版本
    scrollViewProps.mpScrollLeft = scrollViewOffset // Stencil版本
  } else {
    scrollViewProps.scrollTop = scrollViewOffset // React版本
    scrollViewProps.mpScrollTop = scrollViewOffset // Stencil版本
  }

  // H5上额外使用DOM直接操作确保滚动位置正确
  if (isH5) {
    React.useEffect(() => {
      if (containerRef.current && typeof scrollViewOffset === 'number') {
        if (isHorizontal) {
          containerRef.current.scrollLeft = scrollViewOffset
        } else {
          containerRef.current.scrollTop = scrollViewOffset
        }
      }
    }, [scrollViewOffset, isHorizontal])
  }

  // 总高度/宽度
  const totalLength = sectionOffsets[sectionOffsets.length - 1]

  // 吸顶/吸左 header
  const stickyHeaderNode = React.useMemo(() => {
    if (!stickyHeader) return null
    for (let i = 0; i < sections.length; i++) {
      if (sectionOffsets[i] <= renderOffset && renderOffset < sectionOffsets[i + 1]) {
        const section = sections[i]
        if (section.header) {
          const headerSize = getHeaderSize()
          // 内联样式替代className
          const stickyHeaderStyle: React.CSSProperties = {
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 100,
            background: '#fff',
            boxSizing: 'border-box',
            minHeight: '20px',
            overflow: 'hidden',
            lineHeight: 1,
            ...(isHorizontal ? { width: headerSize } : { height: headerSize })
          }
          return (
            <View style={stickyHeaderStyle}>
              {section.header}
            </View>
          )
        }
      }
    }
    return null
  }, [stickyHeader, renderOffset, sectionOffsets, sections, isHorizontal, props.headerHeight, props.headerWidth, props.itemHeight, props.itemWidth, props.itemSize, props.itemData])

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
        // 内联样式替代className
        const sectionHeaderStyle: React.CSSProperties = {
          position: 'absolute',
          zIndex: 2,
          boxSizing: 'border-box',
          width: '100%',
          minHeight: '20px',
          overflow: 'hidden',
          lineHeight: 1,
          ...(isHorizontal
            ? { top: 0, height: '100%', left: offset, width: headerSize }
            : { top: offset, height: headerSize })
        }
        nodes.push(
          React.createElement(View, {
            key: section.key + '-header' + '-' + layout,
            style: sectionHeaderStyle,
          }, section.header)
        )
        offset += headerSize
      }
      // item offsets
      const itemOffsets = accumulate(itemSizes.map((size) => size + space))
      // 内层虚拟滚动：可见item区间
      let startItem = 0; let endItem = section.items.length - 1
      for (let i = 0; i < section.items.length; i++) {
        if (offset + itemOffsets[i + 1] > renderOffset) {
          startItem = Math.max(0, i - cacheCount)
          break
        }
      }
      for (let i = startItem; i < section.items.length; i++) {
        if (offset + itemOffsets[i] >= renderOffset + containerLength) {
          endItem = Math.min(section.items.length - 1, i + cacheCount)
          break
        }
      }
      // 渲染可见item
      for (let i = startItem; i <= endItem; i++) {
        // 内联样式替代className
        const sectionItemStyle: React.CSSProperties = {
          position: 'absolute',
          zIndex: 1,
          boxSizing: 'border-box',
          width: '100%',
          minHeight: '20px',
          overflow: 'hidden',
          lineHeight: 1,
          ...(isHorizontal
            ? {
              top: 0,
              height: '100%',
              left: offset + itemOffsets[i],
              width: itemSizes[i],
              marginRight: space
            }
            : {
              top: offset + itemOffsets[i],
              height: itemSizes[i],
              marginBottom: space
            })
        }
        nodes.push(
          React.createElement(View, {
            key: section.key + '-item-' + i + '-' + layout,
            style: sectionItemStyle,
          }, section.items[i])
        )
      }
      offset += itemOffsets[itemOffsets.length - 1]
    }
    return nodes
  }

  return (
    <ScrollView ref={containerRef} {...scrollViewProps}>
      <View style={isHorizontal ? { width: totalLength, position: 'relative', height: '100%' } : { height: totalLength, position: 'relative', width: '100%' }}>
        {stickyHeaderNode}
        {renderSections()}
      </View>
    </ScrollView>
  )
}

export { List, ListItem, StickyHeader, StickySection }
export default List
