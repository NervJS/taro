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

import fs from 'fs'
import path from 'path'

import { TYPES_DIR } from './constants'

export function camelCaseEnhance (word = '', index: number) {
  word = word.toLowerCase()
  if (index !== 0) {
    word = `${word[0].toUpperCase()}${word.slice(1)}`
  }
  return word
}

export function getTypesList (type = ''): string[] {
  if (type) {
    return fs.readdirSync(path.join('node_modules', 'miniapp-types/dist/types', type))
  }
  return fs.readdirSync(TYPES_DIR)
}

export function getTypeFilePath (name: string): string {
  return path.join(TYPES_DIR, `${name}.d.ts`)
}


