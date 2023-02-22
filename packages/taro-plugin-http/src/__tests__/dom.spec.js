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

describe('DOM', () => {
  process.env.FRAMEWORK = 'nerv'
  const runtime = require('../../dist/runtime')
  const document = runtime.document
  global.document = runtime.document
  
  describe('document', () => {

    it('document setCookie', async () => {
      expect(document.cookie).toBe('')
      document.cookie = 'aaa=1111-2222-33-444-abcdefgasd; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT; secure;'
      document.cookie = 'bbb=23123-aswe-4a7a-a740-f55dfd296b1d; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT'
      document.cookie = 'ccc=69asd3d81234668942; path=/; expires=Mon, 18 Jan 2038 19:14:07 GMT'
      expect(document.cookie).toBe(
        'aaa=1111-2222-33-444-abcdefgasd; bbb=23123-aswe-4a7a-a740-f55dfd296b1d; ccc=69asd3d81234668942'
      )
    })
    
  })
})
