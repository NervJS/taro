import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  ViewPropTypes
} from 'react-native'
import { Mask } from '../Mask'
import { Popup } from '../Popup'
import V from '../variable'

const styles = StyleSheet.create({
  iosActionsheet: {
    backgroundColor: V.weuiBgColorDefault
  },
  androidActionsheetWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  androidActionsheet: {
    width: 274,
    backgroundColor: V.weuiBgColorDefault,
    borderRadius: V.weuiActionSheetAndroidBorderRadius
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
    borderStyle: 'solid'
  },
  iosActionsheetCell: {
    paddingTop: 10,
    paddingBottom: 10
  },
  androidActionsheetCell: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 24,
    paddingRight: 24
  },
  firstActionsheetCell: {
    borderTopWidth: 0
  },
  iosActionsheetCellText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: ((18 * V.baseLineHeight) - 18) / 2,
    marginBottom: ((18 * V.baseLineHeight) - 18) / 2
  },
  androidActionsheetCellText: {
    textAlign: 'left',
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
  }
})

const underlayColor = V.weuiBgColorActive

const Index = ({
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
    menus.map(({type: btnType, label, style: btnStyle, textStyle, ...others}, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          styles[`${_type}ActionsheetCell`],
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[
            styles.actionsheetCellText,
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  const _renderActions = () =>
    actions.map(({type: btnType, label, style: btnStyle, textStyle, ...others}, idx) =>
      <TouchableHighlight
        key={idx}
        underlayColor={underlayColor}
        style={[
          styles.actionsheetCell,
          styles[`${_type}ActionsheetCell`],
          idx === 0 ? styles.firstActionsheetCell : {},
          btnStyle
        ]}
        {...others}
      >
        <Text
          style={[
            styles.actionsheetCellText,
            styles[`${_type}ActionsheetCellText`],
            styles[`${btnType}ActionsheetCellText`],
            textStyle
          ]}
        >{label}</Text>
      </TouchableHighlight>
    )

  return _type === 'ios' ? (
    <Popup
      visible={visible}
      style={[styles.iosActionsheet, style]}
      maskStyle={maskStyle}
      onShow={onShow}
      onClose={onClose}
    >
      {menus.length ? (
        <View style={[styles.actionsheetMenu]}>
          {_renderMenuItems()}
        </View>
      ) : false}
      {actions.length ? (
        <View style={[styles.actionsheetAction]}>
          {_renderActions()}
        </View>
      ) : false}
    </Popup>
  ) : (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onShow={onShow}
      onRequestClose={onClose}
    >
      <Mask style={[styles.androidActionsheetWrapper, maskStyle]} onPress={onClose}>
        <View style={[styles.androidActionsheet, style]}>
          {menus.length ? (
            <View style={[styles.actionsheetMenu]}>
              {_renderMenuItems()}
            </View>
          ) : false}
          {actions.length ? (
            <View style={[styles.actionsheetAction]}>
              {_renderActions()}
            </View>
          ) : false}
        </View>
      </Mask>
    </Modal>
  )
}

Index.propTypes = {
  autoDectect: PropTypes.bool,
  type: PropTypes.oneOf(['ios', 'android']),
  menus: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(PropTypes.object),
  visible: PropTypes.bool,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  style: ViewPropTypes.style,
  maskStyle: ViewPropTypes.style
}

export default Index
