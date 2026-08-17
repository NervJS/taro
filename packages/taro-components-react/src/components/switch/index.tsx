import './style/index.scss'

import { View } from '@tarojs/components'
import classNames from 'classnames'

import { createForwardRefComponent, omit } from '../../utils'
import { useCallback, useState } from '../../utils/hooks'

import type React from 'react'

export type BeforeChange = (value: boolean) => boolean | Promise<boolean>

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'switch' | 'checkbox'
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  color?: string
  width?: number
  height?: number
  beforeChange?: BeforeChange
  nativeProps?: Record<string, any>
  onChange?: (e: any) => void
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
}

function Switch (props: IProps) {
  const {
    type = 'switch',
    checked: controlledChecked,
    defaultChecked = false,
    disabled = false,
    color = '#04BE02',
    width,
    height,
    beforeChange,
    nativeProps = {},
    onChange,
    forwardedRef,
    className,
    style,
    ...rest
  } = props

  const [innerChecked, setInnerChecked] = useState(defaultChecked)
  const [loading, setLoading] = useState(false)

  const isChecked = controlledChecked !== undefined
    ? controlledChecked
    : innerChecked

  const applyChange = useCallback((value: boolean) => {
    if (controlledChecked === undefined) {
      setInnerChecked(value)
    }

    const e = { detail: { value } }
    onChange && onChange(e)
  }, [controlledChecked, onChange])

  const handleToggle = useCallback((newValue: boolean) => {
    if (disabled || loading) return

    if (beforeChange) {
      const result = beforeChange(newValue)

      if (result === false) return

      if (result instanceof Promise) {
        setLoading(true)
        result
          .then((asyncResult) => {
            setLoading(false)
            if (asyncResult === false) return
            applyChange(newValue)
          }, () => {
            setLoading(false)
          })
        return
      }
    }

    applyChange(newValue)
  }, [disabled, loading, beforeChange, applyChange])

  const isSwitch = type === 'switch'
  const sw = width ?? (isSwitch ? 52 : 20)
  const sh = height ?? (isSwitch ? 32 : 20)

  const dynamicStyle: React.CSSProperties = isSwitch ? {
    width: `${sw}px`,
    height: `${sh}px`,
    borderRadius: `${sh / 2}px`,
    backgroundColor: isChecked ? color : '#DFDFDF',
    borderColor: isChecked ? color : '#DFDFDF'
  } : {
    width: `${sh}px`,
    height: `${sh}px`,
    borderRadius: '4px',
    backgroundColor: isChecked ? color : 'transparent',
    borderColor: isChecked ? color : '#c9c9c9'
  }

  const cls = classNames(
    'taro-switch',
    `taro-switch--type-${type}`,
    {
      'taro-switch--checked': isChecked,
      'taro-switch--disabled': disabled
    },
    className
  )

  const rootStyle = {
    ...dynamicStyle,
    ...style
  } as unknown as React.CSSProperties

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleToggle(!isChecked)
  }

  if (isSwitch) {
    const thumbStyle: React.CSSProperties = {
      width: `${sh - 4}px`,
      height: `${sh - 4}px`,
      transform: isChecked ? `translateX(${sw - sh}px)` : undefined
    }
    return (
      <View
        className={cls}
        style={rootStyle}
        ref={forwardedRef}
        onClick={onClick}
        {...omit(rest, ['forwardedRef'])}
        {...nativeProps}
      >
        <View className='taro-switch__thumb' style={thumbStyle} />
      </View>
    )
  }

  return (
    <View
      className={cls}
      style={rootStyle}
      ref={forwardedRef}
      onClick={onClick}
      {...omit(rest, ['forwardedRef'])}
      {...nativeProps}
    >
      <View
        className='taro-switch__checkmark'
        style={{
          width: `${Math.round(sh * 0.3)}px`,
          height: `${Math.round(sh * 0.5)}px`,
          borderRight: `${Math.round(sh * 0.1)}px solid #fff`,
          borderBottom: `${Math.round(sh * 0.1)}px solid #fff`,
          transform: isChecked
            ? `translate(-50%, -65%) rotate(45deg) scale(1)`
            : `translate(-50%, -65%) rotate(45deg) scale(0)`
        }}
      />
    </View>
  )
}

export default createForwardRefComponent(Switch)
