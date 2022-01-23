import * as path from 'path'
import { get, isntTaroMethod, TaroMethod } from '.'
import { DocEntry } from '../parser'
import { childrenMerge, isFunction, isNotAPI, isShowAPI, splicing } from '../parser/utils'
import writeFile from '../write'

export async function writeApiDoc (routePath: string, doc: DocEntry[], withGeneral = false) {
  const _p = path.parse(routePath)
  const merge = await childrenMerge(doc, [])
  const Taro = merge.find(e => e.name === 'Taro')

  if (Taro) {
    for (const e of Taro.exports || []) {
      const name = e.name || 'undefined'
      const tags = e.jsTags || []
      const params = e.parameters || []
      const members = e.members || []
      const md: (string | undefined)[] = []
  
      if (name === 'General' && !withGeneral) continue
      if (tags.find(tag => tag.name === 'ignore')) continue
  
      if (!isFunction(e.flags) && !TaroMethod.includes(e.flags || -1) && !isntTaroMethod.includes(e.flags || -1)) {
        console.warn(`WARN: Symbol flags ${e.flags} is missing parse! Watch symbol name:${name}.`)
      }
  
      const apis = { [`${TaroMethod.includes(e.flags || -1) ? 'Taro.' : ''}${name}`]: tags }
  
      for (const member of members) {
        if (isShowAPI(member.flags)) {
          if (member.name && member.jsTags) apis[`${name}.${member.name}`] = member.jsTags || []
        } else if (!isNotAPI(member.flags)) {
          console.warn(`WARN: Symbol flags ${member.flags} for members is missing parse! Watch member name:${member.name}.`)
        }
      }
  
      md.push(
        get.header({ title: get.title(name, params, e.flags), sidebar_label: name }),
        get.since(tags.find(tag => tag.name === 'since')),
        get.document(e.documentation),
        get.see(tags.find(tag => tag.name === 'see')),
        get.type(e.type, 2),
        get.members(e.members, undefined, 2, TaroMethod.includes(e.flags || -1) ? 'Taro' : name),
        get.members(e.exports || e.parameters, '参数', 2, TaroMethod.includes(e.flags || -1) ? 'Taro' : name),
        get.example(tags),
        get.api(apis),
      )
  
      writeFile(
        path.resolve(_p.name === 'index' ? _p.dir : routePath, `${name}.md`),
        splicing(md),
      )
    }
  }
}
