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

import path from 'path'
// import semver from 'semver'
// import reactNativePKG from 'react-native/package.json'
import StyleTransform from './transforms'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

// 目前仅支持React-Native 0.60+
// const reactNativeVersionString = reactNativePKG.version
// const reactNativeMinorVersion = semver.minor(reactNativeVersionString)

const upstreamTransformer = require('metro-react-native-babel-transformer')

const getSingleStyleTransform = styleTransformIns()

function styleTransformIns () {
  let styleTransform = null
  return function (config) {
    // 初始化 config
    if (!styleTransform) {
      styleTransform = new StyleTransform(config)
    }
    return styleTransform
  }
}

export async function transform (src: string, filename: string, options) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ({ src, filename, options } = src)
  }
  const ext = path.extname(filename)
  if (RN_CSS_EXT.includes(ext)) {
    const styleTransform = getSingleStyleTransform(options.config)
    const styles = await styleTransform.transform(src, filename, options)
    return upstreamTransformer.transform({
      src: styles,
      filename,
      options
    })
  }
  return upstreamTransformer.transform({ src, filename, options })
}
