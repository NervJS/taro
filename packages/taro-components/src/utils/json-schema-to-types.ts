import generator from '@babel/generator'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as fs from 'fs'
import * as humps from 'humps'
import { flattenDeep, isEmpty, toArray, xorWith } from 'lodash'
import * as path from 'path'
import { format as prettify } from 'prettier'

const MINI_APP_TYPES = ['weapp', 'alipay', 'swan', 'tt', 'qq', 'jd'] as const
const COMPONENTS_LIST = [
  'AD',
  'AdCustom',
  'Audio',
  'Block',
  'Button',
  'Camera',
  'Canvas',
  'Checkbox',
  'CheckboxGroup',
  'CoverImage',
  'CoverView',
  'Editor',
  'Form',
  'FunctionalPageNavigator',
  'Icon',
  'Image',
  'Input',
  'Label',
  'LivePlayer',
  'LivePusher',
  'Map',
  'MatchMedia',
  'MovableArea',
  'MovableView',
  'NavigationBar',
  'Navigator',
  'OfficialAccount',
  'OpenData',
  'PageContainer',
  'PageMeta',
  'Picker',
  'PickerView',
  'PickerViewColumn',
  'Progress',
  'Radio',
  'RadioGroup',
  'RichText',
  'ScrollView',
  'ShareElement',
  'Slider',
  'Swiper',
  'SwiperItem',
  'Switch',
  'Text',
  'Textarea',
  'Video',
  'View',
  'VoipRoom',
  'WebView',
]
console.log(COMPONENTS_LIST)
const OMIT_PROPS = ['generic:simple-component']
class GenerateType {
  typesFilePath: string[] = fs.readdirSync(path.join(process.cwd(), 'types'))
  jsonSchemas: any = {}
  component
  constructor (component) {
    this.component = component
    MINI_APP_TYPES.forEach((type) => {
      try {
        const json = require(`miniapp-types/dist/schema/${type}/${
          component === 'AD' ? 'ad' : humps.decamelize(component, { separator: '-' })
        }.json`)

        if (!json) {
          return
        }
        if (!this.jsonSchemas[component]) {
          this.jsonSchemas[component] = {}
        }
        this.jsonSchemas[component][type] = json
      } catch (error) {
        console.log(error)
      }
    })
  }

  // 获取不存在的属性
  getMissingProps (props: { [key in typeof MINI_APP_TYPES[number]]?: string[] }) {
    const obj = {}
    const jsonSchema = this.jsonSchemas[this.component]
    if (!jsonSchema) {
      return obj
    }
    Object.keys(this.jsonSchemas[this.component]).forEach((key) => {
      const filteredList = xorWith(props[key], Object.keys(this.jsonSchemas[this.component][key].properties))
      if (filteredList.length > 0) {
        obj[key] = filteredList.map((item) =>
          item.match(/^bind/) ? humps.camelize(item.replace(/^bind/, 'on')) : item
        )
      }
    })

    return obj
  }

  // 转换不存在的属性，便于添加到已有的类型声明中
  convertProps (props) {
    const array = [...new Set(flattenDeep(toArray(props)))]
    const reverseProps = {}
    array.forEach((prop) => {
      reverseProps[prop] = Object.keys(props).filter((key) => props[key].includes(prop))
    })
    return reverseProps
  }

  updateComment (ast) {
    const component = this.component
    const jsonSchemas = this.jsonSchemas[this.component]
    const existProps: { [key in typeof MINI_APP_TYPES[number]]?: string[] } = {}

    traverse(ast, {
      TSInterfaceDeclaration (astPath) {
        if (astPath.node.id.name !== `${component}Props`) {
          return
        }
        astPath.traverse({
          TSPropertySignature (astPath) {
            const { name } = astPath.node.key as any
            if (!name) {
              return
            }
            const supportedPlatforms: string[] = []

            const covertedName = name.match(/^on/)
              ? name.replace(/^on/, 'bind')
              : humps.decamelize(name, { separator: '-' })
            MINI_APP_TYPES.forEach((type) => {
              if (jsonSchemas[type]?.properties[name]) {
                if (isEmpty(existProps[type])) {
                  existProps[type] = [name]
                }
                existProps[type]?.push(name)
                supportedPlatforms.push(type)
              }

              if (name !== covertedName && jsonSchemas[type]?.properties[covertedName]) {
                if (isEmpty(existProps[type])) {
                  existProps[type] = [covertedName]
                }
                existProps[type]?.push(covertedName)
                supportedPlatforms.push(type)
              }
            })
            if (isEmpty(astPath.node.leadingComments) || !astPath.node.leadingComments?.[0]?.value) {
              return
            }
            const value = astPath.node.leadingComments?.[0]?.value

            // 保留原有 h5 类型
            if (value.toLowerCase().indexOf('h5') > -1) {
              supportedPlatforms.push('h5')
            }

            // 保留原有 rn 类型
            if (value.toLowerCase().indexOf('rn') > -1) {
              supportedPlatforms.push('rn')
            }
            if (isEmpty(supportedPlatforms)) {
              astPath.remove()
            } else {
              astPath.node.leadingComments[0].value = value.replace(
                /@supported .*?\n/,
                `@supported ${supportedPlatforms.join(', ')}\n`
              )
              if (value.match(/@deprecated/)) {
                astPath.node.leadingComments[0].value = value.replace(/\* @deprecated.*?\n/, '')
              }
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
  addProps (ast, props) {
    const component = this.component
    const jsonSchemas = this.jsonSchemas[this.component]
    traverse(ast, {
      TSInterfaceDeclaration (astPath) {
        if (astPath.node.id.name !== `${component}Props`) {
          return
        }
        const addedProps: string[] = []
        astPath.traverse({
          TSInterfaceBody (astPath) {
            Object.keys(props).forEach((prop) => {
              if (OMIT_PROPS.includes(prop)) {
                return
              }
              const node = t.cloneNode(astPath.node.body[0]) as t.TSPropertySignature
              node.key = t.identifier(humps.camelize(prop, { separator: '-' }))
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
                const defaultValue = propSchema.defaultValue
                if (defaultValue) {
                  if (defaultValue instanceof Array) {
                    commentValue += `* @default ${propSchema.defaultValue.join(',')}\n`
                  } else {
                    commentValue += `* @default ${propSchema.defaultValue}\n`
                  }
                }
                node.leadingComments[0].value = commentValue
              }
              astPath.node.body.push(node)
              addedProps.push(prop)
            })
          },
        })
      },
    })
  }

  formatJSDoc (ast) {
    traverse(ast, {
      enter (astPath) {
        if (astPath.node.trailingComments) {
          astPath.node.trailingComments = []
        }
      },
    })
  }

  exec () {
    const filePath = path.join(process.cwd(), 'types', `${this.component}.d.ts`)
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
    this.formatJSDoc(ast)
    const result = generator(ast)
    const code = prettify(result.code, { parser: 'typescript', singleQuote: true, semi: false })
    fs.writeFileSync(filePath, code)
  }
}
COMPONENTS_LIST.forEach((component) => {
  const generateTypes = new GenerateType(component)
  generateTypes.exec()
})

export default GenerateType
