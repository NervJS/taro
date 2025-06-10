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
