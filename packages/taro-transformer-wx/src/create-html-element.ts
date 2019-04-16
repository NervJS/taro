import { Adapters, Adapter } from './adapter'
import { quickappComponentName } from './constant'

const voidHtmlTags = new Set<string>([
  // 'image',
  'img',
  'input',
  'import'
])

if (process.env.NODE_ENV === 'test') {
  voidHtmlTags.add('image')
}

interface Options {
  name: string,
  attributes: object,
  value: string
}

function stringifyAttributes (input: object) {
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
      value: ''
    },
    options
  )

  if (Adapters.quickapp === Adapter.type) {
    const name = options.name
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)
    if (quickappComponentName.has(nameCapitalized)) {
      options.name = `taro-${name}`
    }
    if (isFirstEmit && name === 'div') {
      options.name = 'taro-page'
    }
  }

  const isVoidTag = voidHtmlTags.has(options.name)

  let ret = `<${options.name}${stringifyAttributes(options.attributes)}${isVoidTag ? `/` : '' }>`

  if (!isVoidTag) {
    ret += `${options.value}</${options.name}>`
  }

  return ret
}
