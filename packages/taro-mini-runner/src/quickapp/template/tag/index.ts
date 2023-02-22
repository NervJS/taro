/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
