import { RecursiveTemplate } from '@tarojs/shared/dist/template'

// 声明了鸿蒙模板语法关键词的 Adapter
export class Template extends RecursiveTemplate {
  Adapter = {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    for: 'for',
    forItem: 'for-item',
    forIndex: 'for-index',
    key: 'key',
    type: 'harmony'
  }

  constructor () {
    super()
  }
}
