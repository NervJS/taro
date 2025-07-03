import './style/index.scss'

import { View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// 简单的样式转换函数，参考 Stencil 版本的 convertStyle
const convertStyle = (style: string | React.CSSProperties): React.CSSProperties => {
  if (typeof style === 'string') {
    if (!style) return {}
    const styleObj: any = {}
    style.split(';').forEach(item => {
      const [key, value] = item.split(':')
      if (key && value) {
        const camelKey = key.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        styleObj[camelKey] = value.trim()
      }
    })
    return styleObj
  }
  return style || {}
}

export interface PickerViewProps {
  /** 数组中的数字依次表示选择的第几项（下标从0开始） */
  value?: number[]
  /** 设置选择器中间选中框的样式 */
  indicatorStyle?: React.CSSProperties | string
  /** 设置选择器中间选中框的类名 */
  indicatorClass?: string
  /** 设置蒙层的样式 */
  maskStyle?: React.CSSProperties | string
  /** 设置蒙层的类名 */
  maskClass?: string
  /** 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件 */
  immediateChange?: boolean
  /** 滚动选择时触发change事件，event.detail = {value} */
  onChange?: (e: { detail: { value: number[] } }) => void
  /** 当滚动选择开始时候触发事件 */
  onPickStart?: () => void
  /** 当滚动选择结束时候触发事件 */
  onPickEnd?: () => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  formType?: string
  forwardedRef?: React.MutableRefObject<HTMLDivElement | null>
}

function PickerView(props: PickerViewProps) {
  const {
    value = [],
    indicatorStyle = '',
    indicatorClass = '',
    maskStyle = '',
    maskClass = '',
    immediateChange = false,
    onChange,
    onPickStart,
    onPickEnd,
    children,
    className,
    style,
    formType,
    forwardedRef
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [currentValue, setCurrentValue] = useState<number[]>(value || [])

  // 处理子列的属性更新，参考 Stencil 版本的 handleValueChange
  const handleValueChange = useCallback(() => {
    const container = containerRef.current || forwardedRef?.current
    if (!container) return

    const childList = container.querySelectorAll('.taro-picker-view-column-container')
    childList.forEach((element, index) => {
      element.setAttribute('data-col', `${index}`)
      let selectIndex = 0
      if (currentValue && currentValue.length > index) {
        selectIndex = currentValue[index]
      }
      const pickerHeight = container.getBoundingClientRect().height
      const indicatorHeight = indicatorRef.current?.offsetHeight || 50
      const paddingVertical = (pickerHeight - indicatorHeight) / 2.0
      element.setAttribute('data-initial-position', `${selectIndex}`)
      element.setAttribute('data-padding-vertical', `${paddingVertical}`)
      // 传递 immediateChange 参数
      element.setAttribute('data-immediate-change', `${immediateChange}`)

      // 触发子组件更新事件
      const updateEvent = new CustomEvent('propsupdate', { bubbles: false })
      element.dispatchEvent(updateEvent)
    })
  }, [currentValue, immediateChange, forwardedRef])

  // 监听 value 变化，参考 Stencil 版本的 @Watch
  useEffect(() => {
    setCurrentValue(value || [])
  }, [value])

  useEffect(() => {
    // 延迟执行，确保 DOM 已渲染
    const timer = setTimeout(() => {
      handleValueChange()
    }, 10)
    return () => clearTimeout(timer)
  }, [currentValue, children, handleValueChange])

  // 事件监听器，参考 Stencil 版本的 @Listen
  const onSelect = useCallback((e: CustomEvent<{ curIndex: string, selectedIndex: string }>) => {
    e.stopPropagation()
    if (!(e.target as HTMLElement)?.classList.contains('taro-picker-view-column-container')) return

    if (!e.detail) return // 防护检查

    const curIndex = +e.detail.curIndex
    const selectedIndex = +e.detail.selectedIndex
    const newValue = [...(currentValue || [])] // 确保 currentValue 不为空
    newValue[curIndex] = selectedIndex
    setCurrentValue(newValue)
    onChange?.({ detail: { value: newValue } })
  }, [currentValue, onChange])

  const onSelectStart = useCallback((e: CustomEvent) => {
    e.stopPropagation()
    if (!(e.target as HTMLElement)?.classList.contains('taro-picker-view-column-container')) return
    onPickStart?.()
  }, [onPickStart])

  const onSelectEnd = useCallback((e: CustomEvent) => {
    e.stopPropagation()
    if (!(e.target as HTMLElement)?.classList.contains('taro-picker-view-column-container')) return
    onPickEnd?.()
  }, [onPickEnd])

  // 组件挂载后设置事件监听
  useEffect(() => {
    const container = containerRef.current || forwardedRef?.current
    if (!container) return

    // 添加事件监听器
    container.addEventListener('onselect', onSelect as any)
    container.addEventListener('onselectstart', onSelectStart as any)
    container.addEventListener('onselectend', onSelectEnd as any)

    return () => {
      container.removeEventListener('onselect', onSelect as any)
      container.removeEventListener('onselectstart', onSelectStart as any)
      container.removeEventListener('onselectend', onSelectEnd as any)
    }
  }, [onSelect, onSelectStart, onSelectEnd, forwardedRef])

  // 样式处理，参考 Stencil 版本的 convertStyle
  const indicatorCls = classNames('taro-picker-view-mask-indicator', indicatorClass)
  const maskTopCls = classNames('taro-picker-view-mask-top', maskClass)
  const maskBtmCls = classNames('taro-picker-view-mask-bottom', maskClass)
  const indicatorStyleObj = convertStyle(indicatorStyle)
  const maskTopStyleObj = convertStyle(maskStyle)
  const maskBottomStyleObj = convertStyle(maskStyle)

  return (
    <View
      ref={forwardedRef || containerRef}
      className={classNames('taro-picker-view-container', className)}
      style={style}
      {...(formType ? { 'data-form-type': formType } : {})}
    >
      {/* 直接渲染子组件，类似 Stencil 的 <slot /> */}
      {children}

      {/* 固定的 mask 容器结构，与 Stencil 版本一致 */}
      <View className="taro-picker-view-mask-container">
        <View className={maskTopCls} style={maskTopStyleObj} />
        <View
          className={indicatorCls}
          style={indicatorStyleObj}
          ref={indicatorRef}
        />
        <View className={maskBtmCls} style={maskBottomStyleObj} />
      </View>
    </View>
  )
}

export { PickerViewColumn } from './picker-view-column'

export { PickerView }
export default PickerView
