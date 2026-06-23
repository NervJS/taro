const IS_TARO_WEAPP = process.env.TARO_ENV === 'weapp'

/**
 * 微信小程序：从 Taro 节点 ref 取 SelectorQuery.in 所需作用域（`ref.current._scope`）。
 * 与运行时 TaroNode._scope（getNearestCtx）一致；非小程序恒为 undefined。
 */
export function weappScope (
  ref: { current: any } | null | undefined
): object | undefined {
  if (!IS_TARO_WEAPP || !ref?.current) return undefined
  const cur: any = ref.current
  if (typeof cur?._scope === 'function') {
    return cur._scope()
  }
  if (cur?._scope != null) {
    return cur._scope
  }
  return undefined
}
