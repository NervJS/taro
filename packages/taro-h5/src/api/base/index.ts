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

import { fromByteArray, toByteArray } from 'base64-js'

import { temporarilyNotSupport } from '../../utils'

export const env = {
  FRAMEWORK: process.env.FRAMEWORK,
  TARO_ENV: process.env.TARO_ENV,
  TARO_VERSION: process.env.TARO_VERSION,
}

export const canIUse = temporarilyNotSupport('canIUse')

export function arrayBufferToBase64 (arrayBuffer: ArrayBuffer) {
  return fromByteArray(arrayBuffer as Uint8Array)
}

export function base64ToArrayBuffer (base64: string) {
  return toByteArray(base64)
}

export * from './crypto'
export * from './debug'
export * from './performance'
export * from './system'
export * from './update'
export * from './weapp/app-event'
export * from './weapp/life-cycle'
