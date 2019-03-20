export const enum Adapters {
  weapp = 'weapp',
  swan = 'swan',
  alipay = 'alipay',
  quickapp = 'quickapp',
  tt = 'tt'
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
  if: 's-if',
  else: 's-else',
  elseif: 's-elif',
  for: 's-for',
  forItem: 's-for-item',
  forIndex: 's-for-index',
  key: 's-key',
  type: Adapters.swan
}

const alipayAdapter: Adapter = {
  if: 'a:if',
  else: 'a:else',
  elseif: 'a:elif',
  for: 'a:for',
  forItem: 'a:for-item',
  forIndex: 'a:for-index',
  key: 'a:key',
  type: Adapters.alipay
}

const ttAdapter: Adapter = {
  if: 'tt:if',
  else: 'tt:else',
  elseif: 'tt:elif',
  for: 'tt:for',
  forItem: 'tt:for-item',
  forIndex: 'tt:for-index',
  key: 'tt:key',
  type: Adapters.tt
}

export let Adapter: Adapter = weixinAdapter

export function setAdapter (adapter: Adapters) {
  switch (adapter.toLowerCase()) {
    case Adapters.swan:
      Adapter = swanAdapter
      break
    case Adapters.alipay:
      Adapter = alipayAdapter
      break
    case Adapters.tt:
      Adapter = ttAdapter
      break
    default:
      Adapter = weixinAdapter
      break
  }
}
