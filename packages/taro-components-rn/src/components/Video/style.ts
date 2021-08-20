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

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  'taro-video': {
    width: '100%',
    height: 225,
    lineHeight: 0,
    overflow: 'hidden',
    position: 'relative'
  },

  'taro-video-container': {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },

  'taro-video-type-fullscreen': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999
  },

  'taro-video-cover': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 1
  },

  'taro-video-cover-play-button': {
    width: 30,
    height: 30,
  },

  'taro-video-cover-duration': {
    color: '#fff',
    fontSize: 16,
    marginTop: 10
  },

})
