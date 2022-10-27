interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>
  ref?: React.Ref<any>
}

export const manipulatePropsFunction = <ElementType>(
  originalProps: StencilReactInternalProps<ElementType>,
  propsToPass: Record<string, unknown> = {}
) => {
  const { dangerouslySetInnerHTML } = originalProps
  return {
    ...propsToPass,
    dangerouslySetInnerHTML
  }
}
