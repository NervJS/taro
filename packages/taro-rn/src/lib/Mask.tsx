/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
