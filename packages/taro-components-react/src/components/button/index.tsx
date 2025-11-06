import './style/index.scss'

import { View } from '@tarojs/components'
import classNames from 'classnames'

import { createForwardRefComponent, omit } from '../../utils'
import { useCallback, useEffect, useRef, useState } from '../../utils/hooks'

import type React from 'react'

interface IProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  size?: string
  plain?: boolean
  hoverClass?: string
  hoverStartTime?: number
  hoverStayTime?: number
  disabled?: boolean
  loading?: boolean
  type?: string
  className?: string
  forwardedRef?: React.MutableRefObject<HTMLButtonElement>
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  formType?: 'submit' | 'reset'
}

interface IState {
  hover: boolean
  touch: boolean
}

function Button (props: IProps) {
  const startTimer = useRef<ReturnType<typeof setTimeout>>()
  const endTimer = useRef<ReturnType<typeof setTimeout>>()
  const [state, setState] = useState<IState>({
    hover: false,
    touch: false
  })

  useEffect(() => {
    return () => {
      startTimer.current && clearTimeout(startTimer.current)
      endTimer.current && clearTimeout(endTimer.current)
    }
  }, [])

  const _onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    setState((e) => ({
      ...e,
      touch: true
    }))
    if (props.hoverClass && props.hoverClass !== 'none' && !props.disabled) {
      startTimer.current = setTimeout(() => {
        if ((state as IState).touch) {
          setState((e) => ({
            ...e,
            hover: true
          }))
        }
      }, props.hoverStartTime || 20)
    }
    props.onTouchStart && props.onTouchStart(e)
  }

  const _onTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    setState((e) => ({
      ...e,
      touch: false
    }))
    if (props.hoverClass && props.hoverClass !== 'none' && !props.disabled) {
      endTimer.current = setTimeout(() => {
        if (!(state as IState).touch) {
          setState((e) => ({
            ...e,
            hover: false
          }))
        }
      }, props.hoverStayTime || 70)
    }

    if (!props.disabled && props.formType) {
      const eventName = props.formType === 'submit' ? 'tarobuttonsubmit' : 'tarobuttonreset'
      e.currentTarget.dispatchEvent(new CustomEvent(eventName, { bubbles: true }))
    }

    props.onTouchEnd && props.onTouchEnd(e)
  }

  const { forwardedRef, plain = false, children, disabled = false, className, style, onClick, hoverClass = 'button-hover', loading = false, type = 'default', size, formType, ...restProps } = props

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        // 按钮禁用时阻止事件冒泡并不触发点击回调
        e.stopPropagation()
        return
      }
      // 按钮可用时触发点击回调
      onClick?.(e)
    },
    [disabled, onClick]
  )

  const cls = classNames(
    className,
    'taro-button-core',
    {
      [`${hoverClass}`]: (state as IState).hover && !disabled,
      'taro-btn-disabled': disabled,
      'taro-btn-loading': loading,
      'taro-btn-plain': plain,
      'taro-btn-mini': size === 'mini',
      'taro-btn-default': type === 'default',
      'taro-btn-primary': type === 'primary',
      'taro-btn-warn': type === 'warn'
    }
  )

  return (
    <View
      {...omit(restProps, ['hoverClass', 'onTouchStart', 'onTouchEnd', 'type', 'loading', 'forwardedRef', 'size', 'plain', 'disabled', 'onClick', 'formType'])}
      type={type}
      size={size}
      disabled={disabled}
      ref={forwardedRef}
      className={cls}
      style={style}
      onClick={handleClick}
      onTouchStart={_onTouchStart}
      onTouchEnd={_onTouchEnd}
      plain={plain.toString()}
      form-type={formType as any}
    >
      {!!loading && <View className='weui-loading' />}
      {children}
    </View>
  )
}

export default createForwardRefComponent(Button)
