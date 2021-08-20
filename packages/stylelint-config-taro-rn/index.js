/*
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

module.exports = {
  plugins: ['stylelint-taro-rn'],
  rules: {
    'taro-rn/css-property-no-unknown': true,
    'taro-rn/font-weight-no-ignored-values': [
      true,
      {
        severity: 'warning',
        message:
          '400,700，normal 或 bold 之外的 font-weight 值在Android上的React Native中没有效果'
      }
    ],
    'value-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-disallowed-list': [
      ['keyframes', 'font-face', 'supports', 'charset'],
      {
        severity: 'warning',
        message:
          '@-rule 会被 React Native 忽略'
      }
    ],
    'unit-allowed-list': [
      ['px', 'rem', 'deg', '%', 'vh', 'vw', 'vmin', 'vmax'],
      {
        severity: 'warning',
        message:
          '该单位会被 React Native 忽略'
      }
    ],
    'selector-pseudo-class-allowed-list': [
      ['export', 'root'],
      {
        severity: 'warning',
        message:
          '伪类选择器会被 React Native 忽略'
      }
    ],
    'selector-max-universal': [
      0,
      {
        severity: 'warning',
        message:
          '通配选择器会被 React Native 忽略'
      }
    ],
    'selector-max-attribute': [
      0,
      {
        severity: 'warning',
        message:
          '属性选择器会被 React Native 忽略'
      }
    ],
    'selector-max-type': [
      0,
      {
        severity: 'warning',
        message:
          '通配选择器会被 React Native 忽略'
      }
    ],
    'selector-max-combinators': [
      0,
      {
        severity: 'warning',
        message:
          '组合选择器会被 React Native 忽略'
      }
    ],
    'selector-max-id': [
      0,
      {
        severity: 'warning',
        message:
          'ID 选择器会被 React Native 忽略'
      }
    ]
  }
}
