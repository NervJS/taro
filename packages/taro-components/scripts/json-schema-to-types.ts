import generator from '@babel/generator'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { fs } from '@tarojs/helper'
import { camelCase, paramCase } from 'change-case'
import { flattenDeep, isEmpty, isNil, toArray, xorWith } from 'lodash'
import { format as prettify } from 'prettier'

import { MINI_APP_TYPES } from './constants'
import { camelCaseEnhance, getTypeFilePath, getTypesList } from './utils'

const OMIT_PROPS = ['generic:simple-component', 'style', 'class']
const catchStart = 'catch'
const eventStart = 'on'

type AST = parser.ParseResult<t.File>
type PROP_MAP = Partial<Record<typeof MINI_APP_TYPES[number], string[]>>
type PROP = Record<string, string[]>

class GenerateTypes {
  jsonSchemas: Record<string, any> = {}
  componentName: string

  constructor (componentName: string) {
    this.componentName = componentName

    MINI_APP_TYPES.forEach((type) => {
      try {
        const json = require(`miniapp-types/dist/schema/${type}/${
          componentName === 'AD' ? 'ad' : paramCase(componentName)
        }.json`)

        if (!json) {
          return
        }
        if (!this.jsonSchemas[componentName]) {
          this.jsonSchemas[componentName] = {}
        }
        this.jsonSchemas[componentName][type] = json
      } catch (error) {
        // console.log(error)
        if (!this.jsonSchemas[componentName]) {
          this.jsonSchemas[componentName] = {}
        }
      }
    })
  }

  // 获取不存在的属性
  getMissingProps (props: PROP_MAP) {
    const obj: PROP = {}
    const jsonSchema = this.jsonSchemas[this.componentName]
    if (!jsonSchema) {
      return obj
    }
    Object.keys(this.jsonSchemas[this.componentName]).forEach((key) => {
      const filteredList = xorWith(props[key], Object.keys(this.jsonSchemas[this.componentName][key].properties))
      if (filteredList.length > 0) {
        obj[key] = filteredList.map((item) =>
          item.match(/^bind/) ? camelCase(item.replace(/^bind/, eventStart), { transform: camelCaseEnhance }) : item
        )
      }
    })

    return obj
  }

  // 转换不存在的属性，便于添加到已有的类型声明中
  convertProps (props: PROP = {}) {
    const array = Array.from(new Set(flattenDeep(toArray(props))))
    const reverseProps: PROP = {}
    array.forEach((prop) => {
      reverseProps[prop] = Object.keys(props).filter((key) => props[key].includes(prop))
    })
    return reverseProps
  }

  updateComment (ast: AST) {
    const componentName = this.componentName
    const jsonSchemas = this.jsonSchemas[this.componentName]
    const existProps: PROP_MAP = {}

    traverse(ast, {
      TSInterfaceDeclaration (astPath) {
        if (astPath.node.id.name !== `${componentName}Props`) {
          return
        }
        astPath.traverse({
          TSPropertySignature (astPath) {
            const { name } = astPath.node.key as any
            if (!name) {
              return
            }
            const supportedPlatforms: string[] = []

            const convertedName = name.match(/^on/)
              ? name.replace(/^on/, 'bind')
              : paramCase(name)
            MINI_APP_TYPES.forEach((type) => {
              if (jsonSchemas[type]?.properties[name]) {
                if (isEmpty(existProps[type])) {
                  existProps[type] = [name]
                }
                existProps[type]?.push(name)
                supportedPlatforms.push(type)
              }

              if (name !== convertedName && jsonSchemas[type]?.properties[convertedName]) {
                if (isEmpty(existProps[type])) {
                  existProps[type] = [convertedName]
                }
                existProps[type]?.push(convertedName)
                supportedPlatforms.push(type)
              }
            })
            if (isEmpty(astPath.node.leadingComments) || !astPath.node.leadingComments?.[0]?.value) {
              return
            }
            const value = astPath.node.leadingComments?.[0]?.value || ''
            const preSupportedPlatforms = value.match(/@supported\s+(.+)/)?.[1].toLowerCase().split(/\s?[,，]\s?/) || []
            const isUnique = value.indexOf('@unique') !== -1
            const isIgnore = value.indexOf('@ignore') !== -1

            // 保留内置类型
            const inherentTypes = ['global', 'h5', 'rn', 'quickapp', 'harmony']
            inherentTypes.forEach((type) => {
              if (preSupportedPlatforms?.includes(type)) {
                supportedPlatforms.push(type)
              }
            })

            // 保留 Taro 支持或平台独有特性
            if (isUnique || isIgnore) {
              supportedPlatforms.push(...preSupportedPlatforms)
            }

            if (isEmpty(supportedPlatforms) && !(isUnique || isIgnore)) {
              astPath.remove()
            } else {
              astPath.node.leadingComments[0].value = value.replace(
                /@supported .*?\n/,
                `@supported ${supportedPlatforms.join(', ')}\n`
              )
            }
          },
        })
      },
    })
    return {
      existProps,
      ast,
    }
  }

  // 添加不存在的属性
  addProps (ast: AST, props: PROP = {}) {
    const componentName = this.componentName
    const jsonSchemas = this.jsonSchemas[this.componentName]
    traverse(ast, {
      TSInterfaceDeclaration (astPath) {
        if (astPath.node.id.name !== `${componentName}Props`) {
          return
        }
        const addedProps: string[] = []
        astPath.traverse({
          TSInterfaceBody (astPath) {
            Object.keys(props).forEach((prop) => {
              if (OMIT_PROPS.includes(prop)) {
                return
              }
              const emptySignature = { type: 'TSPropertySignature', key: t.identifier(''), leadingComments: [], kind: 'get' } as t.TSPropertySignature
              const list = astPath.node.body as t.TSPropertySignature[]
              const node = t.cloneNode(list[0] || emptySignature)
              node.key = t.identifier(camelCase(prop, { transform: camelCaseEnhance }))
              const platform = props[prop][0]
              const json = jsonSchemas[platform]
              const propSchema = json.properties[prop] || json.properties[prop.replace(/^on/, 'bind')]
              const { type, tsType, enum: enumArray } = propSchema
              let value
              if (type === 'string') {
                if (!enumArray) {
                  value = t.tsTypeReference(t.identifier(type))
                } else {
                  value = t.tsUnionType(enumArray.map((item) => t.tsLiteralType(t.stringLiteral(item))))
                }
              } else if (['boolean', 'number'].includes(type)) {
                value = t.tsTypeReference(t.identifier(type))
              } else if (['array'].includes(type)) {
                value = t.tsTypeReference(t.identifier('any[]'))
              } else if (type instanceof Array) {
                value = t.tsTypeReference(t.identifier(type.join('|')))
              } else if (tsType === '() => void') {
                value = t.tsTypeReference(t.identifier('CommonEventFunction'))
              } else {
                value = t.tsTypeReference(t.identifier('string'))
              }
              node.typeAnnotation = t.tsTypeAnnotation(value)
              node.optional = !json.required?.[prop] || !json.required?.[prop.replace(/^on/, 'bind')]

              if (node.leadingComments) {
                let commentValue = `* ${propSchema.description?.replace(/\n/g, '\n * ')} \n`
                commentValue += `* @supported ${props[prop].join(', ')}\n`
                const { defaultValue, type } = propSchema
                if (!isNil(defaultValue)) {
                  if (defaultValue instanceof Array) {
                    commentValue += `* @default ${defaultValue.join(',')}\n`
                  } else if (typeof defaultValue === 'string' && !defaultValue.startsWith('"') && !['none', '无'].includes(defaultValue) && type === 'string') {
                    commentValue += `* @default "${propSchema.defaultValue.replace(/(^')|('$)/ig, '')}"\n`
                  } else {
                    commentValue += `* @default ${defaultValue}\n`
                  }
                }

                // @ts-ignore
                node.leadingComments[0] ||= { type: 'CommentBlock' }
                node.leadingComments[0].value = commentValue
              }
              list.push(node)
              addedProps.push(prop)
            })
          },
        })
      },
    })
  }

  formatJSDoc (ast: AST) {
    traverse(ast, {
      enter (astPath) {
        if (astPath.node.trailingComments) {
          astPath.node.trailingComments = []
        }
      },
    })
  }

  // 属性排序
  sortProps (ast: AST) {
    const componentName = this.componentName
    traverse(ast, {
      TSInterfaceDeclaration (astPath) {
        if (astPath.node.id.name !== `${componentName}Props`) {
          return
        }
        astPath.traverse({
          TSInterfaceBody (astPath) {
            astPath.node.body.sort((a: any, b: any) => {
              const aName = a.key?.name
              const bName = b.key?.name

              if (aName.startsWith(catchStart) && !bName.startsWith(catchStart)) return 1
              if (bName.startsWith(catchStart) && !aName.startsWith(catchStart)) return -1

              if (aName.startsWith(eventStart) && !bName.startsWith(eventStart)) return 1
              if (bName.startsWith(eventStart) && !aName.startsWith(eventStart)) return -1

              return 0
            })
          },
        })
      },
    })

  }

  exec () {
    const filePath = getTypeFilePath(this.componentName)
    const codeStr = fs.readFileSync(filePath, 'utf8')
    const ast = parser.parse(codeStr, {
      sourceType: 'module',
      strictMode: false,
      plugins: ['typescript'],
    })
    const { existProps } = this.updateComment(ast)
    const missingProps = this.getMissingProps(existProps)
    const props = this.convertProps(missingProps)
    this.addProps(ast, props)
    this.sortProps(ast)
    this.formatJSDoc(ast)
    const result = generator(ast)
    const code = prettify(result.code, {
      parser: 'typescript', semi: false,
      singleQuote: true,
      printWidth: 120
    })
    fs.writeFileSync(filePath, code)
  }
}

getTypesList().forEach((fileName) => {
  const componentName = fileName.replace(/\.d\.ts$/, '')
  const generateTypes = new GenerateTypes(componentName)
  if (isEmpty(generateTypes.jsonSchemas[componentName])) {
    return
  }
  generateTypes.exec()
})

export default GenerateTypes
