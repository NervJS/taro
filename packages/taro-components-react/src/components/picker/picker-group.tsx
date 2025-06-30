import { PICKER_LINE_HEIGHT, PICKER_MASK_HEIGHT, PICKER_TOP } from '../../utils'
import { useCallback, useState } from '../../utils/hooks'

import type React from 'react'

interface PickerGroupProps {
  mode?: 'time' | 'date'
  range: any[]
  rangeKey?: string
  height: number
  columnId: string
  updateHeight: (height: number, columnId: string, needRevise?: boolean) => void
  updateDay?: (value: number, fields: number) => void
  onColumnChange?: (e: { columnId: string, height: number }) => void
}

interface PickerGroupState {
  startY: number
  preY: number
  hadMove: boolean
  touchEnd: boolean
  isMove: boolean
}

export function PickerGroup(props: PickerGroupProps) {
  const {
    mode,
    range = [],
    rangeKey,
    height,
    columnId,
    updateHeight,
    updateDay,
    onColumnChange
  } = props

  const [state, setState] = useState<PickerGroupState>({
    startY: 0,
    preY: 0,
    hadMove: false,
    touchEnd: false,
    isMove: false
  })

  const getPosition = useCallback(() => {
    const transition = state.touchEnd ? 0.3 : 0
    const transformValue = `translate3d(0, ${height}px, 0)`
    const transitionValue = `transform ${transition}s`
    return {
      transform: transformValue,
      WebkitTransform: transformValue,
      transition: transitionValue,
      WebkitTransition: transitionValue
    }
  }, [height, state.touchEnd])

  const formulaUnlimitedScroll = useCallback((range: number, absoluteHeight: number, direction: 'up' | 'down') => {
    const factor = direction === 'up' ? 1 : -1

    setState(prev => ({ ...prev, touchEnd: false }))

    // 点击超过范围，点击到补帧时，先跳到另一端的补帧
    updateHeight(-range * factor * PICKER_LINE_HEIGHT + height, columnId)

    // 再做过渡动画
    requestAnimationFrame(() => {
      setState(prev => ({ ...prev, touchEnd: true }))
      const index = Math.round(absoluteHeight / -PICKER_LINE_HEIGHT) + range * factor
      const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * index
      updateHeight(relativeHeight, columnId, true)
    })
  }, [height, columnId, updateHeight])

  const handleMoveStart = useCallback((clientY: number) => {
    // 记录第一次的点击位置
    setState(prev => ({
      ...prev,
      startY: clientY,
      preY: clientY,
      hadMove: false
    }))
  }, [])

  const handleMoving = useCallback((clientY: number) => {
    const y = clientY
    const deltaY = y - state.preY

    setState(prev => ({
      ...prev,
      preY: y,
      touchEnd: false,
      hadMove: Math.abs(y - prev.startY) > 10 ? true : prev.hadMove
    }))

    let newPos = height + deltaY

    // 处理时间选择器的无限滚动
    if (mode === 'time') {
      if (columnId === '0') {
        // 数字 28 来自于 4 格补帧 + 0 ～ 23 的 24 格，共 28 格
        if (newPos > PICKER_TOP - PICKER_LINE_HEIGHT * 3) {
          newPos = PICKER_TOP - PICKER_LINE_HEIGHT * 27 + deltaY
        }
        if (newPos < PICKER_TOP - PICKER_LINE_HEIGHT * 28) {
          newPos = PICKER_TOP - PICKER_LINE_HEIGHT * 4 + deltaY
        }
      } else if (columnId === '1') {
        if (newPos > PICKER_TOP - PICKER_LINE_HEIGHT * 3) {
          newPos = PICKER_TOP - PICKER_LINE_HEIGHT * 63 + deltaY
        }
        if (newPos < PICKER_TOP - PICKER_LINE_HEIGHT * 64) {
          newPos = PICKER_TOP - PICKER_LINE_HEIGHT * 4 + deltaY
        }
      }
    }

    updateHeight(newPos, columnId)
  }, [height, state.preY, state.startY, state.hadMove, mode, columnId, updateHeight])

  const handleMoveEnd = useCallback((clientY: number) => {
    const max = 0
    const min = -PICKER_LINE_HEIGHT * (range.length - 1)
    const endY = clientY

    setState(prev => ({ ...prev, touchEnd: true }))

    // touchEnd 时的高度，可能带小数点，需要再处理
    let absoluteHeight: number

    if (!state.hadMove) {
      /** 点击 */
      // 屏幕高度
      const windowHeight = window.innerHeight
      // picker__mask 垂直方向距离屏幕顶部的高度
      const relativeY = windowHeight - PICKER_MASK_HEIGHT / 2

      absoluteHeight = height - PICKER_TOP - (endY - relativeY)

      // 处理时间选择器的无限滚动
      if (mode === 'time') {
        if (columnId === '0') {
          // 点击上溢出
          // absoluteHeight 是相对模块中点来算的，所以会算多半行，这时要减去这半行，即2.5行
          if (absoluteHeight > -PICKER_LINE_HEIGHT * 2.5) {
            return formulaUnlimitedScroll(24, absoluteHeight, 'up')
          }
          // 点击下溢出
          if (absoluteHeight < -PICKER_LINE_HEIGHT * 28.5) {
            return formulaUnlimitedScroll(24, absoluteHeight, 'down')
          }
        } else if (columnId === '1') {
          // 点击上溢出
          if (absoluteHeight > -PICKER_LINE_HEIGHT * 2.5) {
            return formulaUnlimitedScroll(60, absoluteHeight, 'up')
          }
          // 点击下溢出
          if (absoluteHeight < -PICKER_LINE_HEIGHT * 64.5) {
            return formulaUnlimitedScroll(60, absoluteHeight, 'down')
          }
        }
      }
    } else {
      /** 滚动 */
      absoluteHeight = height - PICKER_TOP
    }

    // 边界情况处理
    if (absoluteHeight > max) absoluteHeight = 0
    if (absoluteHeight < min) absoluteHeight = min

    // 先按公式算出 index, 再用此 index 算出一个整数高度
    const index = Math.round(absoluteHeight / -PICKER_LINE_HEIGHT)
    const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * index

    if (mode === 'date' && typeof updateDay === 'function') {
      if (columnId === '0') {
        updateDay(
          +range[index].replace(/[^0-9]/gi, ''),
          0
        )
      }
      if (columnId === '1') {
        updateDay(
          +range[index].replace(/[^0-9]/gi, ''),
          1
        )
      }
      if (columnId === '2') {
        updateDay(
          +range[index].replace(/[^0-9]/gi, ''),
          2
        )
      }
    }

    updateHeight(relativeHeight, columnId, mode === 'time')
    onColumnChange?.({
      columnId,
      height: relativeHeight,
    })
  }, [range.length, state.hadMove, height, mode, columnId, formulaUnlimitedScroll, updateDay, updateHeight, onColumnChange])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleMoveStart(e.changedTouches[0].clientY)
  }, [handleMoveStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleMoving(e.changedTouches[0].clientY)
  }, [handleMoving])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    handleMoveEnd(e.changedTouches[0].clientY)
  }, [handleMoveEnd])

  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    // 判断选中和禁用
    const isSelected = height === PICKER_TOP - PICKER_LINE_HEIGHT * index
    // 这里假设没有禁用逻辑，如有可补充
    return (
      <div key={index} className={`weui-picker__item${isSelected ? ' weui-picker__item--selected' : ''}`}>{content}</div>
    )
  })

  return (
    <div
      className="weui-picker__group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="weui-picker__mask" />
      <div className="weui-picker__indicator" />
      <div className="weui-picker__content" style={getPosition()}>
        {pickerItem}
      </div>
    </div>
  )
}
