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

function isExport (n) {
  return Array.isArray(n) && n[0] === ':export'
}

function byExport (a, b) {
  if (!isExport(a.selectors) && isExport(b.selectors)) {
    return -1
  }
  if (isExport(a.selectors) && !isExport(b.selectors)) {
    return 1
  }
  return 0
}

function byLine (a, b) {
  if (isExport(a.selectors) && isExport(b.selectors)) {
    if (a.position.start.line > b.position.start.line) {
      return 1
    }
    if (a.position.start.line < b.position.start.line) {
      return -1
    }
  }
  return 0
}

export function sortRules (rules) {
  return rules.sort(byExport).sort(byLine)
}
