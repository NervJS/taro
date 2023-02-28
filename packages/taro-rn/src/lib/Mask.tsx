import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { ViewPropTypes } from 'deprecated-react-native-prop-types'

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    zIndex: 1000
  }
})

const Mask: React.FC<any> = ({ transparent = false, style, onPress, children }) =>
  <TouchableWithoutFeedback onPress={onPress}>
    <View
      accessibilityLabel='mask'
      style={[styles.mask, { backgroundColor: transparent ? 'transparent' : 'rgba(0,0,0,.6)' }, style]}
    >
      <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>

Mask.propTypes = {
  transparent: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.node,
  onPress: PropTypes.func
}

export { Mask }
