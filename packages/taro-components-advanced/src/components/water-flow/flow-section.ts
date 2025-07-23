import { View } from '@tarojs/components'
import {
  type CSSProperties,
  type PropsWithChildren,
  Children,
  createElement,
  useMemo,
} from 'react'

import { FlowItemContainer } from './flow-item'
import { Section } from './section'
import { useObservedAttr } from './use-observed-attr'

import type { FlowSectionProps } from './interface'

export interface _FlowSectionProps extends FlowSectionProps {
  section: Section
}

export function FlowSection({
  children,
  ...props
}: PropsWithChildren<FlowSectionProps>) {
  const {
    id,
    className,
    style,
    section,
    rowGap = 0,
    columnGap = 0,
  } = props as _FlowSectionProps
  const layouted$ = useObservedAttr(section, 'layouted')
  const height$ = useObservedAttr(section, 'height')
  const renderRange$ = useObservedAttr(section, 'renderRange')
  const scrollTop$ = useObservedAttr(section, 'scrollTop')

  const sectionStyle: CSSProperties = useMemo(() => {
    const baseStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: height$,
      gap: columnGap,
      visibility: layouted$ ? 'visible' : 'hidden',
      ...style,
    }

    if (!layouted$) {
      return baseStyle
    }

    return {
      ...baseStyle,
      position: 'absolute',
      top: 0,
      transform: `translate3d(0px, ${scrollTop$}px, 0px)`,
      left: 0,
    }
  }, [height$, style, layouted$, scrollTop$, columnGap])

  const columns = useMemo(() => {
    const childNodes = Children.toArray(children)
    const columnStyle: CSSProperties = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: rowGap,
      flex: 1,
    }
    /** 已经完成布局计算，使用虚拟滚动 */
    if (layouted$) {
      return renderRange$.map(([startIndex, endIndex], colIndex) => {
        const columnId = `col-${colIndex}`
        return createElement(
          View,
          {
            style: columnStyle,
            id: columnId,
            key: columnId,
          },
          section.columnMap[colIndex]
            .slice(startIndex, endIndex + 1)
            .map((node) => {
              const childNode = childNodes[node.childIndex]
              const columnProps: any = {
                node,
                key: node.id,
              }
              return createElement(FlowItemContainer, columnProps, childNode)
            })
        )
      })
    }

    return section.columnMap.map((column, colIndex) => {
      const columnId = `col-${colIndex}`
      return createElement(
        View,
        { style: columnStyle, id: columnId, key: columnId },
        column.map((node) => {
          const childNode = childNodes[node.childIndex]
          const columnProps: any = {
            node,
            key: node.id,
          }
          return createElement(FlowItemContainer, columnProps, childNode)
        })
      )
    })
  }, [children, layouted$, section.columnMap, renderRange$, id])

  return createElement(
    View,
    { style: sectionStyle, className, id: id ?? section.id },
    columns
  )
}
