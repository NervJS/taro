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

const { buildDocsMeta } = require('../utils/utils')
// eslint-disable-next-line
const DEFAULT_Components_SET = new Set([
  'View',
  'ScrollView',
  'Swiper',
  'CoverImage',
  'CoverView',
  'Icon',
  'Text',
  'RichText',
  'Progress',
  'Button',
  'Checkbox',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'Radio',
  'RadioGroup',
  'CheckboxGroup',
  'Slider',
  'Switch',
  'Textarea',
  'Navigator',
  'Audio',
  'Image',
  'Video',
  'Camera',
  'LivePlayer',
  'LivePusher',
  'Map',
  'Canvas',
  'OpenData',
  'WebView',
  'SwiperItem',
  'Provider',
  'MovableArea',
  'MovableView'
])

const ERROR_MESSAGE = '不能在自定义组件中写 children'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'custom-component-children')
  },

  create (context) {
    function isChildrenNotEmpty (children) {
      return !(
        (children.type === 'JSXText' || children.type === 'Literal') &&
        children.value.trim() === ''
      )
    }

    return {
      JSXElement (node) {
        const { name } = node.openingElement.name
        if (
          !DEFAULT_Components_SET.has(name) &&
          node.children
            .filter(isChildrenNotEmpty)
            .length > 0
        ) {
          context.report({
            message: ERROR_MESSAGE,
            node
          })
        }
      }
    }
  }
}
