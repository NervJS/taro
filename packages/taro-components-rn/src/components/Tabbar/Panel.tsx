/**
 * Panel
 */

import * as React from 'react'
import {
  View
} from 'react-native'
import styles from './styles'
import { PanelProps } from './PropsType'

const TabbarPanel: React.FC<PanelProps> = ({
  children,
  style,
  ...reset
}: PanelProps) => {
  return (
    <View {...reset} style={[styles.panel, style]}>
      {children}
    </View>
  )
}

TabbarPanel.displayName = 'TabbarPanel'

export default TabbarPanel
