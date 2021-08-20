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

import * as fs from 'fs-extra'
import * as path from 'path'

export default function parseTag (dir: string, tags = {}) {
  dir = dir || '.'
  const dirPath = path.join(__dirname, dir)
  const walk = (file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isFile()) {
      if (path.extname(filePath) === '.js') {
        const tagName = path.basename(path.dirname(filePath))
        if (tagName !== 'tag') {
          const component = require(filePath).default
          tags[tagName] = component
        }
      }
    } else {
      parseTag(path.join(dir, file), tags)
    }
  }
  fs.readdirSync(dirPath).forEach(walk)
  return tags
}
