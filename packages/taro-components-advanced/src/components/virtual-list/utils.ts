interface IHorizontal {
  direction?: string
  layout?: string
}
export function isHorizontalFunc ({ direction, layout }: IHorizontal) {
  return direction === 'horizontal' || layout === 'horizontal'
}
interface IRrl {
  direction?: string
}
export function isRtlFunc ({ direction }: IRrl) {
  return direction === 'rtl'
}
