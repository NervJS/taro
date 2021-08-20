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

/* eslint-disable */
const objectIs = Object.is || function (x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y
  }
  return x !== x && y !== y
}

export default function shallowEqual (obj1, obj2) {
  if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
    return obj1 === obj2
  }

  if (obj1 === null && obj2 === null) {
    return true
  }
  if (obj1 === null || obj2 === null) {
    return false
  }
  if (objectIs(obj1, obj2)) {
    return true
  }
  const obj1Keys = obj1 ? Object.keys(obj1) : []
  const obj2Keys = obj2 ? Object.keys(obj2) : []
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  for (let i = 0; i < obj1Keys.length; i++) {
    const obj1KeyItem = obj1Keys[i]
    if (!obj2.hasOwnProperty(obj1KeyItem) || !objectIs(obj1[obj1KeyItem], obj2[obj1KeyItem])) {
      return false
    }
  }

  return true
}
