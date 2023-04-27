import { fs } from '@tarojs/helper'
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


