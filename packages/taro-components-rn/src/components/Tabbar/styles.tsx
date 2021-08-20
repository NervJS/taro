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

import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native'

const { width, height }: { width: number; height: number } = Dimensions.get('window')

// @todo what about header height.
const contHeight = Platform.select({
  ios: height,
  android: height - (StatusBar.currentHeight || 0)
})

export default StyleSheet.create({
  container: {
    width,
    height: contHeight,
  },
  panel: {
    flexGrow: 1,
  },
  bar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#F7F7FA'
  },
  barItem: {
    flex: 1,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  barItemIcon: {
    width: 27,
    height: 27
  },
  barItemLabel: {
    fontSize: 10,
    color: '#999'
  }
})
