/**
 * Container
 */

import * as React from 'react'
import {
  View
} from 'react-native'
import styles from './styles'
import { ContainerProps } from './PropsType'

const TabbarContainer: React.SFC<ContainerProps> = ({
  children,
  style,
  ...reset
}) => {
  return (
    <View {...reset} style={[styles.container, style]}>
      {children}
    </View>
  )
}

TabbarContainer.displayName = 'TabbarContainer'

export default TabbarContainer
