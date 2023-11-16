declare module '@tarojs/runtime' {
  export * from '@tarojs/runtime/dist/runtime.esm.d.ts'

  export function convertNumber2VP(value: number): string

  export const AREA_CHANGE_EVENT_NAME = 'areaChange'
  export const VISIBLE_CHANGE_EVENT_NAME = 'visibleChange'

  export async function setNodeEventCallbackAndTriggerComponentUpdate (node: TaroElement, eventName: string, callback?: Function | null, isAsync = false): Promise<void>
  export function getPageScrollerOrNode (scrollerOrNode: any, page: any): any
  export const disconnectEvent : (node: TaroElement, eventName: string) => void
}
