import { dashToPascalCase } from '@stencil/vue-output-target/dist/utils'

import type { ComponentCompilerMeta } from '@stencil/core/internal'
import type { ComponentModelConfig } from '@stencil/vue-output-target/dist/types'

export const createVue2ComponentDefinition = (
  [importCompsTypes, importTypes]: [string, string],
  componentModelConfig?: ComponentModelConfig[],
  includeCustomElement = false
) => (cmpMeta: Pick<ComponentCompilerMeta, 'properties' | 'tagName' | 'methods' | 'events'>) => {
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName)
  const importAs = includeCustomElement ? 'define' + tagNameAsPascal : 'undefined'

  let props: string[] = []
  let methods: string[] = []

  if (Array.isArray(cmpMeta.properties) && cmpMeta.properties.length > 0) {
    props = cmpMeta.properties.map((prop) => `  ${prop.name}: {} as PropOptions<${importTypes}.${tagNameAsPascal}['${prop.name}']>`)
  }

  if (Array.isArray(cmpMeta.methods) && cmpMeta.methods.length > 0) {
    methods = cmpMeta.methods.map((method) => `  ${method.name}: createCommonMethod('${method.name}') as ${importCompsTypes}.${tagNameAsPascal}['${method.name}']`)
  }

  let templateString = `\nexport const ${tagNameAsPascal} = /*@__PURE__*/ Vue.extend({`

  const findModel =
    componentModelConfig && componentModelConfig.find((config) => config.elements.includes(cmpMeta.tagName))

  if (props.length > 0) {
    templateString += `\n  props: {${props.length > 0 ? `\n  ${props.join(',\n  ')}\n  ` : ''}},`
  } else if (findModel) {
    templateString += `\n  props: {},`
  }

  if (findModel) {
    templateString += `\n  model: { prop: '${findModel.targetAttr}' , event: '${findModel.event}' },`
  }

  if (methods.length > 0) {
    templateString += `\n  methods: {${methods.length > 0 ? `\n  ${methods.join(',\n  ')}\n  ` : ''}},`
  }

  templateString += `\n  render: createCommonRender('${cmpMeta.tagName}', [${cmpMeta.events.map((e) => `'${e.name}'`).join(', ')}], ${importAs}),`
  templateString += `\n}`
  templateString += `);\n`

  return templateString
}
