interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>
  ref?: React.Ref<any>
}

export const manipulatePropsFunction = <ElementType>(
  originalProps: StencilReactInternalProps<ElementType>,
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
