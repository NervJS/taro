
export const manipulatePropsFunction = (
  originalProps: any,
  propsToPass: Record<string, unknown> = {}
) => {
  const { dangerouslySetInnerHTML, style } = originalProps
  if (typeof style !== 'string') {
    propsToPass.style = style
  }
  return {
    ...propsToPass,
    dangerouslySetInnerHTML
  }
}
