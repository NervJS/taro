import { RecursiveTemplate } from '@tarojs/shared'

export class Template extends RecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'tt:if',
    else: 'tt:else',
    elseif: 'tt:elif',
    for: 'tt:for',
    forItem: 'tt:for-item',
    forIndex: 'tt:for-index',
    key: 'tt:key',
    type: 'tt'
  }
}
