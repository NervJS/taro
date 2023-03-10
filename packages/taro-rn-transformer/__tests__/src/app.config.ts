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
