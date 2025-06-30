import './style/column.scss'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { createForwardRefComponent, debounce } from '../../utils'

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
  const {
    children,
    className,
    style,
    forwardedRef
  } = props

  const columnRef = useRef<HTMLDivElement>(null)
  const [columnState, setColumnState] = useState<ColumnState>({
    col: '0',
    initialPosition: '0',
    paddingVertical: 0,
    immediateChange: false,
    isInit: false
  })

  // 滚动状态管理
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const userScrollTimeoutRef = useRef<NodeJS.Timeout>()

  // 获取当前元素引用
  const getElement = useCallback(() => {
    return forwardedRef?.current || columnRef.current
  }, [forwardedRef])

  // 处理属性变化，参考 Stencil 版本的 componentDidLoad/componentDidUpdate
  const handleChange = useCallback(() => {
    const el = getElement()
    if (!el) return

    setIsAutoScrolling(true)

    // 使用 childNodes 而不是 children，与 Stencil 版本保持一致
    const childList = el.childNodes
    let idx = 0
    let sum = 0

    for (const index in childList) {
      const item = childList[index] as HTMLElement
      if (columnState.initialPosition === index || !item || typeof item.offsetHeight !== 'number') {
        break
      }
      sum += item.offsetHeight
      idx++
    }

    el.scrollTo({ top: sum })

    // 延迟重置自动滚动状态
    setTimeout(() => setIsAutoScrolling(false), 100)

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

  // 发送选择事件
  const emitSelectEvent = useCallback((selectedIndex: string) => {
    const el = getElement()
    if (!el) return

    const selectEvent = new CustomEvent('onselect', {
      detail: {
        curIndex: columnState.col,
        selectedIndex: selectedIndex
      },
      bubbles: true
    })
    el.dispatchEvent(selectEvent)
  }, [columnState.col, getElement])

  // 计算当前选中的索引
  const getCurrentSelectedIndex = useCallback(() => {
    const el = getElement()
    if (!el) return '0'

    const childList = el.childNodes
    let sum = 0
    let selectedIndex = '0'

    for (const index in childList) {
      const item = childList[index] as HTMLElement
      const itemHeight = item.offsetHeight
      if (sum + itemHeight / 2.0 > el.scrollTop) {
        selectedIndex = index
        break
      }
      sum += itemHeight
    }

    return selectedIndex
  }, [getElement])

  // 立即触发 change 事件（用于 immediateChange=true）
  const triggerImmediateChange = useCallback(() => {
    if (isAutoScrolling) return // 忽略自动滚动

    const selectedIndex = getCurrentSelectedIndex()
    emitSelectEvent(selectedIndex)

    // 发送选择结束事件
    const el = getElement()
    if (el) {
      const selectEndEvent = new CustomEvent('onselectend', {
        detail: {},
        bubbles: true
      })
      el.dispatchEvent(selectEndEvent)
    }
  }, [isAutoScrolling, getCurrentSelectedIndex, emitSelectEvent, getElement])

  // 滚动结束自动回到合适的位置，与 Stencil 版本完全一致
  const handleSelected = useCallback(
    debounce(() => {
      if (isAutoScrolling) return // 忽略自动滚动

      const el = getElement()
      if (!el) return

      const selectedIndex = getCurrentSelectedIndex()
      const childList = el.childNodes
      let sum = 0

      // 计算应该滚动到的位置
      for (let i = 0; i < Number(selectedIndex); i++) {
        const item = childList[i] as HTMLElement
        if (item) sum += item.offsetHeight
      }

      setIsAutoScrolling(true)
      el.scrollTo({
        top: sum,
        behavior: 'smooth'
      })

      // 延迟重置状态并发送事件
      setTimeout(() => {
        setIsAutoScrolling(false)
        emitSelectEvent(selectedIndex)

        // 发送选择结束事件
        const selectEndEvent = new CustomEvent('onselectend', {
          detail: {},
          bubbles: true
        })
        el.dispatchEvent(selectEndEvent)
      }, 300) // 等待动画完成
    }, 500),
    [isAutoScrolling, getCurrentSelectedIndex, emitSelectEvent, getElement]
  )

  // 统一的滚动处理
  const handleScroll = useCallback(() => {
    if (isAutoScrolling) return // 忽略自动滚动

    // 清除之前的定时器
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current)
    }

    if (columnState.immediateChange) {
      // immediateChange=true: 短延迟后立即触发（不等待滚动完全停止）
      userScrollTimeoutRef.current = setTimeout(() => {
        triggerImmediateChange()
      }, 100)
    } else {
      // immediateChange=false: 等待滚动完全停止后触发
      handleSelected()
    }
  }, [isAutoScrolling, columnState.immediateChange, triggerImmediateChange, handleSelected])

  // 触摸开始处理
  const handleTouchStart = useCallback(() => {
    const el = getElement()
    if (el) {
      const selectStartEvent = new CustomEvent('onselectstart', {
        detail: {},
        bubbles: true
      })
      el.dispatchEvent(selectStartEvent)
    }
  }, [getElement])

  // 事件监听
  useEffect(() => {
    const el = getElement()
    if (!el) return

    // 监听滚动事件（支持所有滚动方式）
    el.addEventListener('scroll', handleScroll, { passive: true })
    // 监听触摸开始（用于发送 selectstart 事件）
    el.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      el.removeEventListener('scroll', handleScroll)
      el.removeEventListener('touchstart', handleTouchStart)

      // 清理定时器
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current)
      }
    }
  }, [getElement, handleScroll, handleTouchStart])

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

    // 监听父组件的属性更新事件
    el.addEventListener('propsupdate', handlePropsUpdate)

    // 初始读取一次属性
    handlePropsUpdate()

    return () => {
      el.removeEventListener('propsupdate', handlePropsUpdate)
    }
  }, [getElement])

  // 当属性变化时，重新处理初始化，参考 Stencil 版本的组件生命周期
  useEffect(() => {
    if (columnState.isInit) {
      // 延迟执行，确保 DOM 已更新
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
