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

export default function exportNameOnly () {
  const emptyMap = { mappings: '' }
  return {
    name: 'export-name-only',
    renderChunk (code, chunk) {
      const pos = chunk.exports.indexOf('default')
      if (pos > -1) {
        chunk.exports.splice(pos, 1)
      }
      return {
        code: `module.exports = new Set(${JSON.stringify(chunk.exports)})`,
        map: emptyMap
      }
    }
  }
}
