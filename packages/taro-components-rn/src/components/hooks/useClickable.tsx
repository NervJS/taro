import { useEffect, useRef, useState } from 'react'

import {
  GestureResponderEvent,
  GestureResponderHandlers, PanResponder
} from 'react-native'
import { omit } from '../../utils'

export const clickableHandlers: Array<keyof GestureResponderHandlers> = [
  'onStartShouldSetResponder',
  'onMoveShouldSetResponder',
  'onResponderEnd',
  'onResponderGrant',
  'onResponderReject',
  'onResponderMove',
  'onResponderRelease',
  'onResponderStart',
  'onResponderStart',
  'onResponderTerminationRequest',
  'onResponderTerminate',
  'onMoveShouldSetResponderCapture',
]

const getWxAppEvent = (event: GestureResponderEvent) => {
  const nativeEvent = event.nativeEvent
  const { timestamp, target, pageX, pageY, touches = [], changedTouches = [] } = nativeEvent
  return {
    type: 'tap',
    timeStamp: timestamp,
    target: {
      id: target,
      dataset: {}
    },
    currentTarget: {
      id: target,
      dataset: {}
    },
    detail: {
      x: pageX,
      y: pageY
    },
    touches: touches.map((item) => {
      return {
        identifier: item.identifier,
        pageX: item.pageX,
        pageY: item.pageY,
        clientX: item.locationX,
        clientY: item.locationY
      }
    }),
    changedTouches: changedTouches.map((item) => {
      return {
        identifier: item.identifier,
        pageX: item.pageX,
        pageY: item.pageY,
        clientX: item.locationX,
        clientY: item.locationY
      }
    })
  }
}
const useClickable = (props: any) => {
  const {
    style,
    hoverStyle,
    // hoverStopPropagation,
    onClick,
    onLongPress,
    onTouchStart,
    // onTouchMove,
    // onTouchCancel,
    onTouchEnd,
  } = props

  if (
    !hoverStyle &&
    // !hoverStopPropagation &&
    !onClick &&
    !onLongPress &&
    !onTouchStart &&
    // !onTouchMove &&
    // !onTouchCancel &&
    !onTouchEnd
  ) {
    return props
  }

  const [isHover, setIsHover] = useState(false)

  const ref = useRef<{
    startTimestamp: number,
    startTimer?: ReturnType<typeof setTimeout>
    stayTimer?: ReturnType<typeof setTimeout>
    props: any
  }>({
    startTimestamp: 0,
    props: props
  })
  useEffect(() => {
    ref.current.props = props
  })

  useEffect(() => {
    return () => {
      ref.current.startTimer && clearTimeout(ref.current.startTimer)
      ref.current.stayTimer && clearTimeout(ref.current.stayTimer)
    }
  }, [ref])

  const setStartTimer = () => {
    const { hoverStyle, hoverStartTime } = ref.current.props
    if (hoverStyle) {
      ref.current.startTimer && clearTimeout(ref.current.startTimer)
      ref.current.startTimer = setTimeout(() => {
        setIsHover(() => true)
      }, hoverStartTime)
    }
  }

  const setStayTimer = () => {
    const { hoverStyle, hoverStayTime } = ref.current.props
    if (hoverStyle) {
      ref.current.stayTimer && clearTimeout(ref.current.stayTimer)
      ref.current.stayTimer = setTimeout(() => {
        setIsHover(() => false)
      }, hoverStayTime)
    }
  }
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        const {
          hoverStyle,
          onClick,
          onLongPress,
          onTouchStart,
          // onTouchMove,
          // onTouchCancel,
          onTouchEnd
        } = ref.current.props
        return !!(hoverStyle || onClick || onLongPress || onTouchStart || onTouchEnd)
      },
      onShouldBlockNativeResponder: () => false,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { onTouchStart } = ref.current.props
        onTouchStart && onTouchStart(getWxAppEvent(evt))
        ref.current.startTimestamp = evt.nativeEvent.timestamp
        setStartTimer()
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
        const { onClick, onLongPress, onTouchEnd } = ref.current.props
        onTouchEnd && onTouchEnd(getWxAppEvent(evt))
        const endTimestamp = evt.nativeEvent.timestamp
        const gapTime = endTimestamp - ref.current.startTimestamp
        // 1 =>3, 修复部分android机型(三星折叠屏尤为明显),单击时dx,dy为>1，而被误判为move的情况。
        const hasMove = Math.abs(gestureState.dx) >= 3 || Math.abs(gestureState.dy) >= 3
        if (!hasMove) {
          if (gapTime <= 350) {
            onClick && onClick(getWxAppEvent(evt))
          } else {
            onLongPress && onLongPress(getWxAppEvent(evt))
          }
        }
        setStayTimer()
      },
      onPanResponderTerminate: () => {
        // const { onTouchCancel } = this.props
        // onTouchCancel && onTouchCancel(this.getWxAppEvent(evt))
        setStayTimer()
      }
    })
  ).current

  return {
    ...omit(props, [
      'style',
      'hoverStyle',
      'hoverStartTime',
      'hoverStayTime',
      'onClick',
      'onLongPress',
      'onTouchStart',
      // 'onTouchMove',
      // 'onTouchCancel',
      'onTouchEnd'
    ]),
    ...panResponder.panHandlers,
    style: [{ backgroundColor: 'transparent' }, style, isHover && hoverStyle]
  }
}

export default useClickable
