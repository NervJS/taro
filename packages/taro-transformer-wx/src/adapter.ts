export const enum Adapters {
  weapp = 'weapp',
  swan = 'swan',
  alipay = 'alipay',
  quickapp = 'quickapp',
  tt = 'tt',
  qq = 'qq',
  jd = 'jd',
}

interface Adapter {
  if: string
  else: string
  elseif: string
  for: string
  forItem: string
  forIndex: string
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
  type: Adapters.weapp,
}

const swanAdapter: Adapter = {
  if: 's-if',
  else: 's-else',
  elseif: 's-elif',
  for: 's-for',
  forItem: 's-for-item',
  forIndex: 's-for-index',
  key: 's-key',
  type: Adapters.swan,
}

const alipayAdapter: Adapter = {
  if: 'a:if',
  else: 'a:else',
  elseif: 'a:elif',
  for: 'a:for',
  forItem: 'a:for-item',
  forIndex: 'a:for-index',
  key: 'a:key',
  type: Adapters.alipay,
}

const ttAdapter: Adapter = {
  if: 'tt:if',
  else: 'tt:else',
  elseif: 'tt:elif',
  for: 'tt:for',
  forItem: 'tt:for-item',
  forIndex: 'tt:for-index',
  key: 'tt:key',
  type: Adapters.tt,
}

const quickappAdapter: Adapter = {
  if: 'if',
  else: 'else',
  elseif: 'elif',
  for: 'for',
  forItem: 'for-item',
  forIndex: 'for-index',
  key: 'key',
  type: Adapters.quickapp,
}

const qqAdapter: Adapter = {
  if: 'qq:if',
  else: 'qq:else',
  elseif: 'qq:elif',
  for: 'qq:for',
  forItem: 'qq:for-item',
  forIndex: 'qq:for-index',
  key: 'qq:key',
  type: Adapters.qq,
}

const jdAdapter: Adapter = {
  if: 'jd:if',
  else: 'jd:else',
  elseif: 'jd:elif',
  for: 'jd:for',
  forItem: 'jd:for-item',
  forIndex: 'jd:for-index',
  key: 'jd:key',
  type: Adapters.jd,
}

export let Adapter: Adapter = weixinAdapter

export const isNewPropsSystem = () => {
  return [
    Adapters.weapp,
    Adapters.swan,
    Adapters.tt,
    Adapters.qq,
    Adapters.alipay,
    Adapters.quickapp,
    Adapters.jd,
  ].includes(Adapter.type)
}

export function setAdapter(adapter: Adapters) {
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
    case Adapters.quickapp:
      Adapter = quickappAdapter
      break
    case Adapters.qq:
      Adapter = qqAdapter
      break
    case Adapters.jd:
      Adapter = jdAdapter
      break
    default:
      Adapter = weixinAdapter
      break
  }
}
