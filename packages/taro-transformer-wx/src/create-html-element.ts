import { camelCase } from 'lodash'

import { Adapter, Adapters } from './adapter'
import { DEFAULT_Component_SET_COPY, LOOP_ORIGINAL, quickappComponentName } from './constant'
import { isTestEnv } from './env'
import { transformOptions } from './options'

const voidHtmlTags = new Set<string>([
  // 'image',
  'img',
  'input',
  'import',
])

if (isTestEnv) {
  voidHtmlTags.add('image')
}

export const capitalized = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

interface Options {
  name: string
  attributes: object
  value: string
}

function stringifyAttributes(input: object, componentName: string) {
  const attributes: string[] = []

  for (const key of Object.keys(input)) {
    let value = input[key]

    if (value === false) {
      continue
    }

    if (Array.isArray(value)) {
      value = value.join(' ')
    }

    let attribute = key

    if (Adapters.quickapp === Adapter.type && key === 'style') {
      const nameCapitalized = capitalized(componentName)
      if (
        !['div', 'text'].includes(componentName) &&
        (quickappComponentName.has(nameCapitalized) || DEFAULT_Component_SET_COPY.has(nameCapitalized))
      ) {
        attribute = 'customstyle'
      }
    }

    if (
      process.env.NODE_ENV !== 'test' &&
      (Adapters.weapp === Adapter.type || Adapters.qq === Adapter.type) &&
      key === Adapter.key &&
      typeof value === 'string'
    ) {
      value = value.split(`${LOOP_ORIGINAL}.`).join('')
    }

    if (value !== true) {
      attribute += `="${String(value)}"`
    }

    attributes.push(attribute)
  }

  return attributes.length > 0 ? ' ' + attributes.join(' ') : ''
}

export const createHTMLElement = (options: Options, isFirstEmit = false) => {
  options = Object.assign(
    {
      name: 'div',
      attributes: {},
      value: '',
    },
    options
  )
  const name = options.name
  if (Adapters.quickapp === Adapter.type) {
    const nameCapitalized = capitalized(name)
    if (quickappComponentName.has(nameCapitalized)) {
      options.name = `taro-${name}`
      // @ts-ignore
      if (options.attributes.className) {
        // @ts-ignore
        options.attributes.class = options.attributes.className
        // @ts-ignore
        delete options.attributes.className
      }
    }
    if (isFirstEmit && name === 'div' && transformOptions.isRoot) {
      options.name = 'taro-page'
      for (const key in options.attributes) {
        if (options.attributes.hasOwnProperty(key)) {
          const attr = options.attributes[key]
          options.attributes[camelCase(key)] = attr
          delete options.attributes[key]
        }
      }
    }
    if (name === 'view') {
      options.name = 'div'
    }
  }

  const isVoidTag = voidHtmlTags.has(options.name)

  let ret = `<${options.name}${stringifyAttributes(options.attributes, name)}${isVoidTag ? `/` : ''}>`

  if (!isVoidTag) {
    ret += `${options.value}</${options.name}>`
  }

  return ret
}
