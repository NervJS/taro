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

import { AnyHTMLElement } from '@stencil/core/internal'

export const delay = (ms = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function toCamelCase (s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function printUnimplementedWarning (node?: Node) {
  const name = node?.nodeName.slice(5).replace('-CORE', '').toLowerCase() || 'unknown'
  return `H5 暂不支持 ${capitalize(toCamelCase(name))} 组件！`
}

export function parsePx2Number (px: string) {
  return Number(px.replace('px', ''))
}

export async function getBoundingClientRect (el: AnyHTMLElement): Promise<DOMRect> {
  const style = await el.getComputedStyle()
  const rect = {
    top: parsePx2Number(style.top),
    left: parsePx2Number(style.left),
    right: parsePx2Number(style.right),
    bottom: parsePx2Number(style.bottom),
    height: parsePx2Number(style.height),
    width: parsePx2Number(style.width),
    x: parsePx2Number(style.x),
    y: parsePx2Number(style.y),
  }
  return {
    ...rect,
    toJSON: () => rect
  }
}

export function parseStyle2String (...styles: Record<string, string | number>[]) {
  const style = Object.assign({}, ...styles)
  return Object.entries(style).map(([key, value]) => `${key}: ${value};`).join('')
}
