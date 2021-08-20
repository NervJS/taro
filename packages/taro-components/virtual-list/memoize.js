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

/**
 *
 * Based on memoize-one from Alexander Reardon.
 *
 * Copyright (c) 2019 Alexander Reardon
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// https://github.com/alexreardon/memoize-one#readme

function areInputsEqual (newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false
  }
  for (let i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false
    }
  }
  return true
}

export function memoizeOne (resultFn, isEqual) {
  // eslint-disable-next-line no-void
  if (isEqual === void 0) { isEqual = areInputsEqual }
  let lastThis
  let lastArgs = []
  let lastResult
  let calledOnce = false
  function memoized () {
    const newArgs = []
    for (let _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i]
    }
    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult
    }
    lastResult = resultFn.apply(this, newArgs)
    calledOnce = true
    lastThis = this
    lastArgs = newArgs
    return lastResult
  }
  return memoized
}
