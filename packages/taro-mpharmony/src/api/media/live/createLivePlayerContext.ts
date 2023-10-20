import Taro from '@tarojs/api'

import { findDOM } from '../../../utils'
import { LivePlayerContext } from './LivePlayerContext'

export const createLivePlayerContext: typeof Taro.createLivePlayerContext = (id, inst) => {
  const el = findDOM(inst) as HTMLElement
  const LivePlayer = el?.querySelector(`taro-live-player-core[id=${id}]`) as unknown as Taro.LivePlayerContext
  const context = new LivePlayerContext(LivePlayer)
  return context
}