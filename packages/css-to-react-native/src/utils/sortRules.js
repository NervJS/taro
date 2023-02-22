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
 *  SOFTWARE.
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
