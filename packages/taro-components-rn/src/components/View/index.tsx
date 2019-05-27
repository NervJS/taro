/**
 * ✔ hoverStyle (hover-class)
 * ✘ hover-stop-propagation
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 */

import * as React from 'react'
import {
  View
} from 'react-native'
import ClickableSimplified from '../ClickableSimplified'
import { ViewProps } from './PropsType'

const _View: React.SFC<ViewProps> = (props) => {
  return (
    <View
      style={props.style}
      {...props}
    >
      {props.children}
    </View>
  )
}

_View.displayName = '_View'

export { _View }
export default ClickableSimplified(_View)
