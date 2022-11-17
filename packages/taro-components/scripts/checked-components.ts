import { pascalCase } from 'change-case'

import { MINI_APP_TYPES } from './constants'
import { getTypesList } from './utils'

/**
 * 寻找小程序端存在，但未在 taro-components 中实现的组件
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
