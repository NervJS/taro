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

import { pascalCase } from 'change-case'

import { MINI_APP_TYPES } from './constants'
import { getTypesList } from './utils'

/**
 * 寻找小程序端存在，但未在 taro-components 中实现的组件
 *
 * Note: 缺失组件可以新增 types/[ComponentName].d.ts 文件，然后通过 json-schema 来生成对应的组件文件
 * ```ts
 * import { ComponentType } from 'react'
 * import { StandardProps } from './common'
 * interface [ComponentName]Props extends StandardProps {}
 * declare const [ComponentName]: ComponentType<[ComponentName]Props>
 * export { [ComponentName], [ComponentName]Props }
 * ```
 */
export function findMissingComponents () {
  const existComponents = ['Index', ...getTypesList().map(fileName => {
    return fileName.replace(/\.d\.ts$/, '')
  })]
  const missingComponents: Record<string, string[]> = {}
  MINI_APP_TYPES.forEach((type) => {
    const typeComponents = getTypesList(type)
    typeComponents.forEach(typePath => {
      const componentName = pascalCase(typePath.replace(/\.d\.ts$/, ''))
      if (!existComponents.includes(componentName)) {
        missingComponents[componentName] ||= []
        missingComponents[componentName].push(type)
      }
    })
  })
  return missingComponents
}

console.log('Find Missing Components:', findMissingComponents())
