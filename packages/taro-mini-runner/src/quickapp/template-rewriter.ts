import parseXml from './template/parser'
import rewriteNode from './template/node'
import serialize from './template/serialize'

export default function rewriterTemplate (code: string): string {
  // 解析Code
  const viewNodes = parseXml(`<root>${code}</root>`).children
  // 解析视图组件
  const retNodes = rewriteNode(viewNodes)
  // 生成xml代码
  const templateCode = serialize(retNodes)
  return templateCode
}
