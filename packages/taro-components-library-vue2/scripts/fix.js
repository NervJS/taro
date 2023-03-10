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
 *  SOFTWARE.
 */

const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')
const utilsPath = path.resolve(__dirname, '..', 'src/vue-component-lib/utils.ts')

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  let code = codeBuffer.toString().replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

  if (!code.includes('fragment')) {
    const comps = ['block', 'custom-wrapper']
    code = code.replace(new RegExp(`taro-(${comps.join('|')})-core`, 'ig'), 'fragment')
  }

  fs.writeFileSync(componentsPath, code)
}

if (fs.existsSync(utilsPath)) {
  const codeBuffer = fs.readFileSync(utilsPath)
  // Note: 事件优化代码
  const eventCode = `vueElement.$emit(eventName, event); if (['input', 'change'].includes(eventName)) vueElement.$emit('update:modelValue', event.detail.value);`
  // Note: click 事件绑定 tap 事件触发
  const listenersCode = `on: { ...allListeners, click: (event) => { typeof allListeners.click === 'function' && allListeners.click(event); vueElement.$emit('tap', event); } }`
  const code = codeBuffer.toString()
    .replace(/let[\s\S]*vueElement\.\$emit\(eventName,\semittedValue\);/, eventCode)
    .replace(/on: allListeners/g, listenersCode)

  fs.writeFileSync(utilsPath, code)
}
