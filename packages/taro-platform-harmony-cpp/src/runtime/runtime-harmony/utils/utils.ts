import { isString } from '../../utils/is'

import type { TaroAny } from '@tarojs/runtime'

export function getParameterError ({ name = '', para, correct, wrong, level = 'error' }: TaroAny) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name ? `${name}:fail ` : ''}parameter ${level}: ${parameter} should be ${correct} instead of ${errorType}`
}

export function upperCaseFirstLetter (string: string): string {
  if (!isString(string)) return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function object2String (obj) {
  let str = ''
  for (const item in obj) {
    str = str + item + ':' + obj[item] + ' \n'
  }
  return str
}

export * from './validate'
