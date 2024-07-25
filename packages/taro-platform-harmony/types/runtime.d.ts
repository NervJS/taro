declare module '@tarojs/runtime' {
  export * from '@tarojs/runtime/dist/index'

  export function convertNumber2VP(value: number): string

  export const AREA_CHANGE_EVENT_NAME = 'areaChange'
  export const VISIBLE_CHANGE_EVENT_NAME = 'visibleChange'

  export async function setNodeEventCallbackAndTriggerComponentUpdate (node: TaroElement, eventName: string, callback?: Function | null, isAsync = false): Promise<void>
  export function getPageScrollerOrNode (scrollerOrNode: any, page: any): any
  export const disconnectEvent : (node: TaroElement, eventName: string) => void

  export type TaroAny = any
  export type ObjectAssign = typeof Object.assign

  export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: true): T[] | null
  export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll?: false): T | null
  export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: boolean): T[] | T | null

  export const window: any
  export type TFunc = (...args: any[]) => any

  export const context: {
    resolver: Promise.resolve
    value: any
  }
  export const uiContext: typeof context
}
