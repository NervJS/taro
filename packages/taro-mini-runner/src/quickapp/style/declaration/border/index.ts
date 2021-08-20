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

function valueType (value) {
  const styles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
  // 需要考虑到0px简写为0的情况，否则会当作color处理。
  if (/px/ig.test(value) || parseInt(value, 10) === 0 || value === 'none') {
    return 'width'
  } else if (~styles.indexOf(value)) {
    return 'style'
  } else {
    return 'color'
  }
}

function setStyle (direction, value, addDeclaration) {
  const values = value.split(' ')
  for (let i = 0, length = values.length; i < length; i++) {
    const borderProperty = `border-${direction}-${valueType(values[i])}`
    if (values[i] === 'none') {
      values[i] = '0'
    }
    if (/\S+style$/.test(borderProperty)) {
      addDeclaration('border-style', values[i])
    } else {
      addDeclaration(borderProperty, values[i])
    }
  }
  return 'I:'
}

function setWidth (value, declaration) {
  const styles = ['thin', 'medium', 'thick', 'inherit']
  const values = ['1px', '2px', '3px', '1px']
  const valueList = value.split(' ')
  value = valueList[0]
  if (~styles.indexOf(value)) {
    const index = styles.indexOf(value)
    value = values[index]
  }
  if (~value.indexOf('%')) {
    value = 750 / 100 * parseInt(value, 10) + 'px'
  }
  declaration.value = value
}

export default {
  border: (value, declaration, _) => {
    if (value === 'none') {
      declaration.value = 0
    }
    return ''
  },
  'border-color': '',
  'border-style': '',
  'border-width': (value, declaration, _) => { // width也不支持百分数，后期在转换
    setWidth(value, declaration)
  },
  'border-radius': (value, declaration, _) => { // width也不支持百分数，后期在转换
    if (~value.indexOf('%')) {
      // 其实应当按照当前组件的宽高为基准计算，但这里拿不到，暂时这样处理下。
      value = 750 / 100 * parseInt(value, 10) + 'px'
      declaration.value = value
    }
  },
  'border-top': (value, declaration, addDeclaration) => {
    return setStyle('top', value, addDeclaration)
  },
  'border-bottom': (value, declaration, addDeclaration) => {
    return setStyle('bottom', value, addDeclaration)
  },
  'border-left': (value, declaration, addDeclaration) => {
    return setStyle('left', value, addDeclaration)
  },
  'border-right': (value, declaration, addDeclaration) => {
    return setStyle('right', value, addDeclaration)
  },
  'border-left-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-right-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-top-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-bottom-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-left-color': '',
  'border-right-color': '',
  'border-top-color': '',
  'border-bottom-color': '',
  'border-left-radius': '',
  'border-right-radius': '',
  'border-top-radius': '',
  'border-top-left-radius': '',
  'border-top-right-radius': '',
  'border-bottom-radius': '',
  'border-bottom-left-radius': '',
  'border-bottom-right-radius': '',
  'border-top-style': 'I:',
  'border-bottom-style': 'I:',
  'border-left-style': 'I:',
  'border-right-style': 'I:'
}
