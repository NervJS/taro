import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text, ViewPropTypes, TouchableOpacity } from 'react-native'
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

const PopupHeader: React.FC<any> = ({ style, left, right }) => {
  return (
    <View style={[styles.popupHeader, style]}>
      <TouchableOpacity
        style={[styles.popupActionLeft, left.style]}
        onPress={left}>
        <Text>{left.label}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.popupActionRight, right.style]}
        onPress={right.onPress}>
        <Text>{right.label}</Text>
      </TouchableOpacity>
    </View>
  )
}

PopupHeader.propTypes = {
  style: ViewPropTypes.style,
  left: PropTypes.shape({
    label: PropTypes.string,
    style: PropTypes.object,
    onPress: PropTypes.func
  }),
  right: PropTypes.shape({
    label: PropTypes.string,
    style: PropTypes.object,
    onPress: PropTypes.func
  })
}

export default PopupHeader
