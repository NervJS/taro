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

export default {
  pages: [
    'pages/index/index',
    'pages/expo/index',
    'pages/app/index',
    'pages/app/text'
  ],
  subPackages: [
    {
      root: 'package1',
      pages: [
        'pages/sub/test1',
        'pages/sub/app'
      ]
    }],
  tabBar: {
    backgroundColor: '#ffffff',
    color: '#999',
    selectedColor: '#ff552e',
    list: [{
      pagePath: 'pages/index/index',
      iconPath: 'image/icon_component.png',
      selectedIconPath: 'image/icon_component_HL.png',
      text: '首页'
    }, {
      pagePath: 'pages/expo/index',
      iconPath: 'image/icon_API.png',
      selectedIconPath: 'image/icon_API_HL.png',
      text: 'expo'
    }]
  }
}
