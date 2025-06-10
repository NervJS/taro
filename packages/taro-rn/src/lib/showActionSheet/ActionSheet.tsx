import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'

import { Popup } from '../Popup'
import V from '../variable'

const styles = StyleSheet.create({
  actionsheet: {
    backgroundColor: V.weuiBgColorDefault
  },
  androidActionsheetWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionsheetMenu: {
    backgroundColor: '#fff'
  },
  actionsheetAction: {
    marginTop: 6,
    backgroundColor: '#fff'
  },
  actionsheetCell: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: V.weuiCellBorderColor,
    borderStyle: 'solid',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 24,
    paddingRight: 24
  },

  firstActionsheetCell: {
    borderTopWidth: 0
  },
  actionSheetCellText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: ((18 * V.baseLineHeight) - 18) / 2,
    marginBottom: ((18 * V.baseLineHeight) - 18) / 2
  },
  androidActionsheetCellText: {
    fontSize: 16,
    marginTop: ((16 * 1.4) - 16) / 2,
    marginBottom: ((16 * 1.4) - 16) / 2
  },
  defaultActionsheetCellText: {
    color: '#000'
  },
  primaryActionsheetCellText: {
    color: '#0BB20C'
  },
  warnActionsheetCellText: {
    color: V.weuiColorWarn
  },
  Modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  }
})

const underlayColor = V.weuiBgColorActive

const Index: React.FC<any> = ({
  visible,
  style,
  maskStyle,
  onShow,
  onClose,
  menus = [],
  actions = [],
  autoDectect = true,
  type = 'ios'
}) => {
  let _type = type
  if (autoDectect) _type = Platform.OS

  const _renderMenuItems = () =>
    menus.map(({ type: btnType, label, style: btnStyle, textStyle, ...others }: any, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[

            styles.actionSheetCellText,
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  const _renderActions = () =>
    actions.map(({ type: btnType, label, style: btnStyle, textStyle, ...others }: any, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[
            styles.actionSheetCellText,
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  return <Popup
    visible={visible}
    style={[styles.actionsheet, style]}
    maskStyle={maskStyle}
    onShow={onShow}
    onClose={onClose}
  >
    {menus.length
      ? <View style={[styles.actionsheetMenu]}>
        {_renderMenuItems()}
      </View>
      : false}
    {actions.length
      ? <View style={[styles.actionsheetAction]}>
        {_renderActions()}
      </View>
      : false}
    <View style={{ paddingBottom: Math.max(initialWindowMetrics?.insets.bottom || 0, 16), backgroundColor: '#fff' }}></View>
  </Popup>
}

Index.propTypes = {
  autoDectect: PropTypes.bool,
  type: PropTypes.oneOf(['ios', 'android', 'harmony']),
  menus: PropTypes.any,
  actions: PropTypes.any,
  visible: PropTypes.bool,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  style: ViewPropTypes.style,
  maskStyle: ViewPropTypes.style
}

export default Index
