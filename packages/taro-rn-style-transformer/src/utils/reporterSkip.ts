/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

interface Location {
  line: number
  column: number
  file: string
}

export default function reporterSkip ({ skipRows, filename }) {
  return {
    postcssPlugin: 'postcss-reporter-skip',
    // @ts-ignore
    Once (css, result) {
      result.messages?.forEach((message: any) => {
        const { line, column, node } = message

        const messageInput = node?.source?.input
        if (messageInput) {
          const originLocation: Location = messageInput.origin(line, column)
          // 如果是原始引入的样式文件，则对拼接的代码（addionalData）函数做减法
          if (originLocation && originLocation.file.includes(filename)) {
            // force modify line，then source map cannot read origin column, value is 0.
            message.line -= skipRows
          }
        }
      })
    }
  }
}
