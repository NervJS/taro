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

import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'

// 富文本
export class EditorContext implements Taro.EditorContext {
  blur = temporarilyNotSupport('EditorContext.blur')

  clear = temporarilyNotSupport('EditorContext.clear')

  format = temporarilyNotSupport('EditorContext.format')

  getContents = temporarilyNotSupport('EditorContext.getContents')

  getSelectionText = temporarilyNotSupport('EditorContext.getSelectionText')

  insertDivider = temporarilyNotSupport('EditorContext.insertDivider')

  insertImage = temporarilyNotSupport('EditorContext.insertImage')

  insertText = temporarilyNotSupport('EditorContext.insertText')

  redo = temporarilyNotSupport('EditorContext.redo')

  removeFormat = temporarilyNotSupport('EditorContext.removeFormat')

  scrollIntoView = temporarilyNotSupport('EditorContext.scrollIntoView')

  setContents = temporarilyNotSupport('EditorContext.setContents')

  undo = temporarilyNotSupport('EditorContext.undo')
}
