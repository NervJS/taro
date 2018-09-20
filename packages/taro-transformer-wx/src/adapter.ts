export const enum Adapters {
  weapp = 'weapp',
  swan = 'swan',
  alipay = 'alipay',
  quickapp = 'quickapp'
}

interface Adapter {
  if: string,
  else: string,
  elseif: string,
  for: string,
  forItem: string,
  forIndex: string,
  key: string
  type: Adapters
}

const weixinAdapter: Adapter = {
  if: 'wx:if',
  else: 'wx:else',
  elseif: 'wx:elif',
  for: 'wx:for',
  forItem: 'wx:for-item',
  forIndex: 'wx:for-index',
  key: 'wx:key',
  type: Adapters.weapp
}

const swanAdapter: Adapter = {
  if: 'wx:if',
  else: 'wx:else',
  elseif: 'wx:elif',
  for: 'wx:for',
  forItem: 'wx:for-item',
  forIndex: 'wx:for-index',
  key: 'wx:key',
  type: Adapters.swan
}

export let Adapter: Adapter = weixinAdapter

export function setAdapter (adapter: Adapters) {
  switch (adapter) {
    case Adapters.swan:
      Adapter = swanAdapter
      break
    default:
      Adapter = weixinAdapter
      break
  }
}
