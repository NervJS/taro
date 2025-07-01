import './style/column.scss'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { createForwardRefComponent } from '../../utils'

export interface PickerViewColumnProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  forwardedRef?: React.MutableRefObject<HTMLDivElement | null>
}

interface ColumnState {
  col: string
  initialPosition: string
  paddingVertical: number
  immediateChange: boolean
  isInit: boolean
}

function PickerViewColumnInner(props: PickerViewColumnProps) {
  const { children, className, style, forwardedRef } = props
  const columnRef = useRef<HTMLDivElement>(null)
  const selectedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [columnState, setColumnState] = useState<ColumnState>({
    col: '0',
    initialPosition: '0',
    paddingVertical: 0,
    immediateChange: false,
    isInit: false
  })

  const getElement = useCallback(() => {
    return forwardedRef?.current || columnRef.current
  }, [forwardedRef])

  // 处理属性变化 - 与Stencil版本componentDidLoad/componentDidUpdate一致
  const handleChange = useCallback(() => {
    const el = getElement()
    if (!el) return

    const childList = el.childNodes
    let idx = 0
    let sum = 0

    // 与Stencil版本完全一致的遍历方式
    for (const index in childList) {
      const item = childList[index] as HTMLElement
      if (columnState.initialPosition === index || !item || typeof item.offsetHeight !== 'number') {
        break
      }
      sum += item.offsetHeight
      idx++
    }

    el.scrollTo({ top: sum })

    if (idx >= childList.length) {
      const selectEvent = new CustomEvent('onselect', {
        detail: {
          curIndex: columnState.col,
          selectedIndex: String(idx - 1)
        },
        bubbles: true
      })
      el.dispatchEvent(selectEvent)
    }
  }, [columnState.initialPosition, columnState.col, getElement])

  // 🔧 核心修复：自实现debounce效果
  const handleSelected = useCallback(() => {
    // 清除之前的定时器
    if (selectedTimeoutRef.current) {
      clearTimeout(selectedTimeoutRef.current)
      selectedTimeoutRef.current = null
    }

    // 设置新的定时器，实现debounce效果
    selectedTimeoutRef.current = setTimeout(() => {
      const el = getElement()
      if (!el) return

      const childList = el.childNodes
      let sum = 0
      let selectedIndex: string = '0'

      // 与Stencil版本完全一致的计算方式
      for (const index in childList) {
        const item = childList[index] as HTMLElement
        const itemHeight = item.offsetHeight
        if (sum + itemHeight / 2.0 > el.scrollTop) {
          selectedIndex = index
          break
        }
        sum += itemHeight
      }

      el.scrollTo({
        top: sum,
        behavior: 'smooth'
      })

      const selectEvent = new CustomEvent('onselect', {
        detail: {
          curIndex: columnState.col,
          selectedIndex: selectedIndex
        },
        bubbles: true
      })
      el.dispatchEvent(selectEvent)

      const selectEndEvent = new CustomEvent('onselectend', {
        detail: {},
        bubbles: true
      })
      el.dispatchEvent(selectEndEvent)
    }, 500)
  }, [columnState.col, getElement])

  // 🔧 立即触发选择逻辑
  const handleImmediateSelect = useCallback(() => {
    const el = getElement()
    if (!el) return

    const childList = el.childNodes
    let sum = 0
    let selectedIndex: string = '0'

    for (const index in childList) {
      const item = childList[index] as HTMLElement
      const itemHeight = item.offsetHeight
      if (sum + itemHeight / 2.0 > el.scrollTop) {
        selectedIndex = index
        break
      }
      sum += itemHeight
    }

    const selectEvent = new CustomEvent('onselect', {
      detail: {
        curIndex: columnState.col,
        selectedIndex: selectedIndex
      },
      bubbles: true
    })
    el.dispatchEvent(selectEvent)
  }, [columnState.col, getElement])

  // 🔧 关键修复：touchstart时取消debounce
  const handleTouchStart = useCallback(() => {
    // 🔧 取消debounce定时器，防止闪回
    if (selectedTimeoutRef.current) {
      clearTimeout(selectedTimeoutRef.current)
      selectedTimeoutRef.current = null
    }

    const el = getElement()
    if (el) {
      const selectStartEvent = new CustomEvent('onselectstart', {
        detail: {},
        bubbles: true
      })
      el.dispatchEvent(selectStartEvent)
    }
  }, [getElement])

  // 触摸结束处理
  const handleTouchEnd = useCallback(() => {
    if (columnState.immediateChange) {
      handleImmediateSelect()
    } else {
      handleSelected()
    }
  }, [columnState.immediateChange, handleImmediateSelect, handleSelected])

  // 🔧 scroll事件处理：支持滚轮
  const handleScroll = useCallback(() => {
    if (columnState.immediateChange) {
      handleImmediateSelect()
    } else {
      handleSelected()
    }
  }, [columnState.immediateChange, handleImmediateSelect, handleSelected])

  // 事件监听
  useEffect(() => {
    const el = getElement()
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('scroll', handleScroll, { passive: true }) // 支持滚轮

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('scroll', handleScroll)

      // 清理定时器
      if (selectedTimeoutRef.current) {
        clearTimeout(selectedTimeoutRef.current)
      }
    }
  }, [getElement, handleTouchStart, handleTouchEnd, handleScroll])

  // 监听父组件传递的属性更新
  useEffect(() => {
    const el = getElement()
    if (!el) return

    const handlePropsUpdate = () => {
      const col = el.getAttribute('data-col') || '0'
      const initialPosition = el.getAttribute('data-initial-position') || '0'
      const paddingVertical = Number(el.getAttribute('data-padding-vertical')) || 0
      const immediateChange = el.getAttribute('data-immediate-change') === 'true'

      setColumnState(prev => ({
        ...prev,
        col,
        initialPosition,
        paddingVertical,
        immediateChange,
        isInit: true
      }))
    }

    el.addEventListener('propsupdate', handlePropsUpdate)
    handlePropsUpdate()

    return () => {
      el.removeEventListener('propsupdate', handlePropsUpdate)
    }
  }, [getElement])

  // 当属性变化时，重新处理初始化
  useEffect(() => {
    if (columnState.isInit) {
      const timer = setTimeout(() => {
        handleChange()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [columnState.isInit, columnState.initialPosition, columnState.paddingVertical, children, handleChange])

  return (
    <div
      ref={forwardedRef || columnRef}
      className={`taro-picker-view-column-container ${className || ''}`}
      style={{
        paddingTop: `${columnState.paddingVertical}px`,
        paddingBottom: `${columnState.paddingVertical}px`,
        ...style
      }}
    >
      {children}
    </div>
  )
}

const WrappedPickerViewColumn = createForwardRefComponent(PickerViewColumnInner)
export { WrappedPickerViewColumn as PickerViewColumn }
export default WrappedPickerViewColumn
