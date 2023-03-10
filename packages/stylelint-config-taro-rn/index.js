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
 *  SOFTWARE.
 */

module.exports = {
  plugins: ['stylelint-taro-rn'],
  rules: {
    'taro-rn/css-property-no-unknown': true,
    'taro-rn/line-height-no-value-without-unit': true,
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
