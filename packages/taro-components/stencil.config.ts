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

import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
const { jsWithTs: tsjPreset } = require('ts-jest/presets')

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './node_modules/weui/dist/style/weui.min.css',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    }
  ],
  bundles: [
    { components: ['taro-picker-core', 'taro-picker-group'] },
    { components: ['taro-checkbox-core', 'taro-checkbox-group-core'] },
    { components: ['taro-radio-core', 'taro-radio-group-core'] },
    { components: ['taro-swiper-core', 'taro-swiper-item-core'] },
    { components: ['taro-video-core', 'taro-video-control', 'taro-video-danmu'] }
  ],
  buildEs5: 'prod',
  testing: {
    testRegex: '(/__tests__/.*|(\\.|/)(tt|spec))\\.[jt]sx?$',
    transform: {
      ...tsjPreset.transform
    },
    globals: {
      'ts-jest': {
        diagnostics: false,
        tsConfig: {
          jsx: 'react',
          allowJs: true,
          target: 'ES6'
        }
      }
    },
    emulate: [{
      device: 'iPhone 8'
    }]
  }
}
