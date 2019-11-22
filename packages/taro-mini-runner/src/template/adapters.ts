import { BUILD_TYPES } from '../utils/constants'

interface Adapter {
  if: string;
  else: string;
  elseif: string;
  for: string;
  forItem: string;
  forIndex: string;
  key: string;
  xs?: string,
  type: BUILD_TYPES;
}

const weixinAdapter: Adapter = {
  if: 'wx:if',
  else: 'wx:else',
  elseif: 'wx:elif',
  for: 'wx:for',
  forItem: 'wx:for-item',
  forIndex: 'wx:for-index',
  key: 'wx:key',
  xs: 'wxs',
  type: BUILD_TYPES.WEAPP
}

const swanAdapter: Adapter = {
  if: 's-if',
  else: 's-else',
  elseif: 's-elif',
  for: 's-for',
  forItem: 's-for-item',
  forIndex: 's-for-index',
  key: 's-key',
  xs: 'sjs',
  type: BUILD_TYPES.SWAN
}

const alipayAdapter: Adapter = {
  if: 'a:if',
  else: 'a:else',
  elseif: 'a:elif',
  for: 'a:for',
  forItem: 'a:for-item',
  forIndex: 'a:for-index',
  key: 'a:key',
  xs: 'sjs',
  type: BUILD_TYPES.ALIPAY
}

const ttAdapter: Adapter = {
  if: 'tt:if',
  else: 'tt:else',
  elseif: 'tt:elif',
  for: 'tt:for',
  forItem: 'tt:for-item',
  forIndex: 'tt:for-index',
  key: 'tt:key',
  type: BUILD_TYPES.TT
}

const quickappAdapter: Adapter = {
  if: 'if',
  else: 'else',
  elseif: 'elif',
  for: 'for',
  forItem: 'for-item',
  forIndex: 'for-index',
  key: 'key',
  type: BUILD_TYPES.QUICKAPP
}

const qqAdapter: Adapter = {
  if: 'qq:if',
  else: 'qq:else',
  elseif: 'qq:elif',
  for: 'qq:for',
  forItem: 'qq:for-item',
  forIndex: 'qq:for-index',
  key: 'qq:key',
  type: BUILD_TYPES.QQ
}

export const supportXS = () => {
  return [BUILD_TYPES.QQ, BUILD_TYPES.WEAPP, BUILD_TYPES.SWAN, BUILD_TYPES.ALIPAY].includes(Adapter.type)
}

export let Adapter: Adapter = weixinAdapter

export function setAdapter (adapter: BUILD_TYPES) {
  switch (adapter.toLowerCase()) {
    case BUILD_TYPES.SWAN:
      Adapter = swanAdapter
      break
    case BUILD_TYPES.ALIPAY:
      Adapter = alipayAdapter
      break
    case BUILD_TYPES.TT:
      Adapter = ttAdapter
      break
    case BUILD_TYPES.QUICKAPP:
      Adapter = quickappAdapter
      break
    case BUILD_TYPES.QQ:
      Adapter = qqAdapter
      break
    default:
      Adapter = weixinAdapter
      break
  }
}
