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

// TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
// Chrome does not seem to adhere; its scrollLeft values are positive (measured relative to the left).
// Safari's elastic bounce makes detecting this even more complicated wrt potential false positives.
// The safest way to check this is to intentionally set a negative offset,
// and then verify that the subsequent "scroll" event matches the negative offset.
// If it does not match, then we can assume a non-standard RTL scroll implementation.

let cachedRTLResult = null

export function getRTLOffsetType (recalculate = false) {
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement('div')
    const outerStyle = outerDiv.style
    outerStyle.width = '50px'
    outerStyle.height = '50px'
    outerStyle.overflow = 'scroll'
    outerStyle.direction = 'rtl'
    const innerDiv = document.createElement('div')
    const innerStyle = innerDiv.style
    innerStyle.width = '100px'
    innerStyle.height = '100px'
    outerDiv.appendChild(innerDiv)
    document.body.appendChild(outerDiv)

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = 'positive-descending'
    } else {
      outerDiv.scrollLeft = 1

      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = 'negative'
      } else {
        cachedRTLResult = 'positive-ascending'
      }
    }

    document.body.removeChild(outerDiv)
    return cachedRTLResult
  }

  return cachedRTLResult
}
