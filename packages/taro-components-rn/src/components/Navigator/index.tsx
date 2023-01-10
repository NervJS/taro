import React, {
  useCallback,
} from 'react'
import {
  navigateTo,
  navigateBack,
  redirectTo,
  switchTab,
  reLaunch,
} from '@tarojs/router-rn'
import type { NavigatorProps } from '@tarojs/components/types/Navigator'

import View from '../View'
import { omit } from '../../utils'

export default function Navigator (props: NavigatorProps) {
  const {
    url = '',
    openType,
    delta
  } = props

  const handleClick = useCallback(() => {
    switch (openType) {
      case 'navigateBack':
        navigateBack({ delta })
        break
      case 'redirect':
        redirectTo({ url })
        break
      case 'switchTab':
        switchTab({ url })
        break
      case 'reLaunch':
        reLaunch({ url })
        break
      default:
        navigateTo({ url })
        break
    }
  }, [openType, url, delta])
  const otherProps = omit(props, ['url', 'openType', 'delta'])
  return <View onClick={handleClick} {...otherProps} />
}
