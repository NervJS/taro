import type { Shortcuts } from '@tarojs/shared'
import type { PageConfig } from '@tarojs/taro'

export interface MpInstance {
  config: PageConfig
  setData: (data: unknown, cb: () => void) => void
  route?: string
  __route__: string
  $taroParams?: Record<string, unknown>
  $taroPath: string
  __data__: any
  data: any
  selectComponent: (selector: string) => any
}

export interface MiniElementData {
  [Shortcuts.Childnodes]?: MiniData[]
  [Shortcuts.NodeName]: string
  [Shortcuts.Class]?: string
  [Shortcuts.Style]?: string
  uid: string
  [key: string]: unknown
}

interface MiniTextData {
  [Shortcuts.Text]: string
  [Shortcuts.NodeName]: string
}

export type MiniData = MiniElementData | MiniTextData

export type HydratedData = () => MiniData | MiniData[]
