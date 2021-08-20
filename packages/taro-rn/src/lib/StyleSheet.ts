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

import { StyleSheet, Platform } from 'react-native'

interface Styles {
  [propName: string]: any
}

export function create(styles: Styles): any {
  const platformStyles: any = {}
  Object.keys(styles).forEach((name) => {
    const copyStyles = { ...styles[name] }
    const ios = copyStyles.ios
    const android = copyStyles.android
    /* eslint-disable no-param-reassign */
    delete styles[name].ios
    delete styles[name].android
    /* eslint-enable no-param-reassign */
    let { ...style } = { ...styles[name] }
    if (ios && Platform.OS === 'ios') {
      style = { ...style, ...ios }
    }
    if (android && Platform.OS === 'android') {
      style = { ...style, ...android }
    }
    platformStyles[name] = style
  })
  return StyleSheet.create(platformStyles)
}

export default { create }
