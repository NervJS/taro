import React, {
  useCallback,
} from 'react'
import type { NavigatorProps } from '@tarojs/components/types/Navigator'
import View from '../View'
import { omit } from '../../utils'

let navigateTo, navigateBack, redirectTo, switchTab, reLaunch
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const routerObj = require('@tarojs/router-rn')
  navigateTo = routerObj?.navigateTo
  navigateBack = routerObj?.navigateBack
  redirectTo = routerObj?.redirectTo
  switchTab = routerObj?.switchTab
  reLaunch = routerObj?.reLaunch
} catch (error) {}

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
