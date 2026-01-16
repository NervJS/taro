import { TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'

import { Mask } from '../Mask'
import { create } from '../StyleSheet'
import V from '../variable'

const { width } = Dimensions.get('window')
const styles = create({
  dialogWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialog: {
    width: width - 60,
    backgroundColor: V.weuiDialogBackgroundColor,
    borderRadius: 3,
    overflow: 'hidden'
  },
  dialogHeader: {
    paddingTop: 1.3 * V.baseFontSize,
    paddingBottom: 0.5 * V.baseFontSize,
    paddingLeft: V.weuiDialogGapWidth,
    paddingRight: V.weuiDialogGapWidth
  },
  dialogTitle: {
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center'
  },

  androidDialogTitle: {
    fontSize: 21,
    textAlign: 'left'
  },

  dialogBody: {
    paddingLeft: V.weuiDialogGapWidth,
    paddingRight: V.weuiDialogGapWidth,
    marginBottom: 32
  },

  dialogBodyText: {
    color: V.weuiTextColorGray,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 17 * 1.4,
    android: {
      lineHeight: Math.round(17 * 1.4)
    }
  },

  androidDialogBodyText: {
    textAlign: 'left'
  },
  dialogFooter: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogFooterBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: V.weuiDialogLineColor,
    borderStyle: 'solid'
  },
  androidDialogFooter: {
    height: 42,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: V.weuiDialogGapWidth,
    paddingRight: V.weuiDialogGapWidth,
    paddingBottom: 16 * 0.7
  },
  dialogFooterOpr: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    flex: 1,
  },
  androidDialogFooterOpr: {
    height: 42,
    paddingLeft: 16 * 0.8,
    paddingRight: 16 * 0.8
  },

  dialogFooterOprWithNegativeMarginRight: {
    marginRight: 0 - (16 * 0.8)
  },
  dialogFooterOprWithBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: V.weuiDialogLineColor,
    borderStyle: 'solid'
  },
  dialogFooterOprText: {
    fontSize: 18
  },
  androidDialogFooterOprText: {
    fontSize: 16
  },

  defaultDialogFooterOprText: {
    color: '#353535'
  },
  primaryDialogFooterOprText: {
    color: '#0BB20C'
  },
  warnDialogFooterOprText: {
    color: V.weuiColorWarn
  },
  Modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  visible: {
    display: 'flex'
  },
  hidden: {
    display: 'none'
  }
})

const underlayColor = V.weuiDialogLinkActiveBc

// 类型定义
const Index: React.FC<any> = (
  {
    visible = false,
    buttons = [],
    title,
    style,
    maskStyle,
    headerStyle,
    titleStyle,
    bodyStyle,
    bodyTextStyle,
    footerStyle,
    children,
    onClose,
    autoDectect = true,
    type = 'ios'
  }) => {
  let _type = type
  if (autoDectect) _type = Platform.OS

  const _renderButtons = () =>
    buttons.map(({ type: btnType, label, ...others }: any, idx) =>
      <TouchableHighlight
        key={idx}
        style={[
          styles.dialogFooterOpr,
          styles[`${_type}DialogFooterOpr`],
          _type === 'android' && idx === buttons.length - 1 ? styles.dialogFooterOprWithNegativeMarginRight : (
            idx > 0 ? styles.dialogFooterOprWithBorder : {}
          ),
        ]}
        underlayColor={underlayColor}
        {...others}
      >
        <Text
          style={[styles.dialogFooterOprText, styles[`${_type}DialogFooterOprText`], { color: btnType }]}
        >{label}</Text>
      </TouchableHighlight>
    )

  const childrenWithProps = React.Children.map(children, (child) => {
    if (child.type.displayName === 'Text') {
      return React.cloneElement(child, {
        style: [styles.dialogBodyText, styles[`${_type}DialogBodyText`], bodyTextStyle, child.props.style]
      })
    }
    return child
  })

  return (
    <View
      style={[styles.Modal, visible ? styles.visible : styles.hidden]}
    >
      <Mask style={[styles.dialogWrapper, maskStyle]} onPress={onClose}>
        <View style={[styles.dialog, style]}>
          <View style={[styles.dialogHeader, headerStyle]}>
            <Text style={[styles.dialogTitle, styles[`${_type}DialogTitle`], titleStyle]}>{title}</Text>
          </View>
          <View style={[styles.dialogBody, bodyStyle]}>
            {childrenWithProps}
          </View>
          <View style={[styles.dialogFooter, styles[`${_type}DialogFooter`], _type !== 'android' ? styles.dialogFooterBorder : {}, footerStyle]}>
            {_renderButtons()}
          </View>
        </View>
      </Mask>
    </View>
  )
}

Index.propTypes = {
  autoDectect: PropTypes.bool,
  type: PropTypes.oneOf(['ios', 'android', 'harmony']),
  title: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.object),
  visible: PropTypes.bool,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  style: ViewPropTypes.style,
  maskStyle: ViewPropTypes.style,
  headerStyle: ViewPropTypes.style,
  titleStyle: TextPropTypes.style,
  bodyStyle: ViewPropTypes.style,
  bodyTextStyle: TextPropTypes.style,
  footerStyle: ViewPropTypes.style,
  children: PropTypes.node
}

export default Index
