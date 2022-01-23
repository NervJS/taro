import { DocEntry } from '../parser'
import { childrenMerge } from '../parser/utils'
import writeFile from '../write'

export async function writeJson (routePath: string, doc: DocEntry[]) {
  const merge = await childrenMerge(doc, [])
  const Taro = merge.find(e => e.name === 'Taro')

  writeFile(`${routePath}.json`, JSON.stringify(Taro, undefined, 2))
}