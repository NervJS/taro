import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text, ViewPropTypes } from 'react-native'
import V from '../variable'

const styles = StyleSheet.create({
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    backgroundColor: '#fbf9fe'
  },
  popupActionLeft: {
    flex: 1,
    color: '#586C94',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontSize: V.baseFontSize
  },
  popupActionRight: {
    flex: 1,
    color: '#586C94',
    textAlign: 'right',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    fontSize: V.baseFontSize
  }
})

const PopupHeader = ({ style, left = {}, right = {} }) =>
  <View style={[styles.popupHeader, style]}>
    <Text
      style={[styles.popupActionLeft, left.style]}
      onPress={left.onPress}
    >{left.label}</Text>
    <Text
      style={[styles.popupActionRight, right.style]}
      onPress={right.onPress}
    >{right.label}</Text>
  </View>

PopupHeader.propTypes = {
  style: ViewPropTypes.style,
  left: PropTypes.object,
  right: PropTypes.object
}

export default PopupHeader
