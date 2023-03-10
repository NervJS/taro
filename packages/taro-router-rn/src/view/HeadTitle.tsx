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

import * as React from 'react'
import { Text, View } from 'react-native'

import { navigationRef } from '../rootNavigation'
import Loading from './Loading'

export interface HeadTitleProps {
  label: string
  color: string
  headerProps?: any
}

export default class HeadTitle extends React.PureComponent<HeadTitleProps> {
  render () {
    // showLoading自定义的参数放在params中
    const params: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {}
    const { showLoading = false } = params?.navigateConfig || {}
    const { label, color, headerProps } = this.props
    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showLoading && <Loading />}
      <Text style={{
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: headerProps.tintColor || color,
        paddingLeft: 2
      }}
      >{headerProps?.children || label}</Text>
    </View>
  }
}
