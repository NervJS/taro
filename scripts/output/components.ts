import * as path from 'path'
import * as ts from 'typescript'
import { get, isntTaroMethod, TaroMethod } from '.'
import { DocEntry } from '../parser'
import { childrenMerge, isFunction, isNotAPI, isShowAPI, splicing } from '../parser/utils'
import writeFile from '../write'

export async function writeDoc (routePath: string, doc: DocEntry[]) {
  const isComp = true
  const _p = path.parse(routePath)
  const merge = await childrenMerge(doc, [])
  const Component = merge.find(e => e.name === _p.name) || {}
  const ComponentTags = Component.jsTags || []
    
  const apis = { [`${_p.name}`]: ComponentTags }

  for (const member of Component && (Component.members || [])) {
    if (isShowAPI(member.flags)) {
      if (member.name && member.jsTags) apis[`${_p.name}.${member.name}`] = member.jsTags || []
    } else if (!isNotAPI(member.flags)) {
      console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
    }
  }

  const name = (_p.name && _p.name.split(/(?<!^)(?=[A-Z])/).join('-') || 'undefined').toLocaleLowerCase()
  const classification = ComponentTags.find(tag => tag.name === 'classification')?.text?.[0]?.text || ''

  ComponentTags.every(tag => tag.name !== 'ignore') && writeFile(
    path.resolve(_p.dir, classification, `${name}.md`),
    splicing([
      get.header({ title: _p.name, sidebar_label: _p.name }),
      get.since(ComponentTags.find(tag => tag.name === 'since')),
      get.document(Component.documentation),
      get.see(ComponentTags.find(tag => tag.name === 'see')),
      get.type(Component.type, 2),
      get.members(Component.members, undefined, 2, name, isComp),
      get.members(Component.exports || Component.parameters, '参数', 2, name, isComp),
      get.example(ComponentTags),
      ...merge.map(e => {
        const name = e.name || 'undefined'
        if (name === _p.name) return undefined
        const tags = e.jsTags || []
        const md: (string | undefined)[] = []

        if (e.flags === ts.SymbolFlags.TypeLiteral) return undefined
        if (tags.find(tag => tag.name === 'ignore')) return undefined
    
        if (!isFunction(e.flags) && !TaroMethod.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) {
          console.warn(`WARN: Symbol flags ${e.flags} is missing parse! Watch symbol name:${name}.`)
        }
    
        md.push(
          `## ${name}\n`,
          get.since(tags.find(tag => tag.name === 'since')),
          get.document(e.documentation),
          get.see(tags.find(tag => tag.name === 'see')),
          get.type(e.type, 3),
          get.members(e.members, undefined, 3, name, isComp),
          get.members(e.exports || e.parameters, '参数', 3, name, isComp),
          get.example(tags, 3),
        )

        return splicing(md)
      }),
      get.api(apis),
    ]),
  )
}