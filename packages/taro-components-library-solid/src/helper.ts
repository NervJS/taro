export const manipulatePropsFunction = (
  _: any,
  propsToPass: Record<string, unknown> = {}
) => {
  // solid暂时不需要配置转换props
  return {
    ...propsToPass,
  }
}
