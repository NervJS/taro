/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { View, Text } from 'react-native'
import Loading from './Loading'
import { navigationRef } from '../rootNavigation'

export interface HeadTitleProps {
  label: string,
  color: string,
  headerProps?: any
}

export default class HeadTitle extends React.PureComponent<HeadTitleProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
