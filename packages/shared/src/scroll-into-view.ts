/** Scroll only the supplied container, applying an offset to the aligned target position. */
export function scrollIntoViewWithOffset (
  container: HTMLElement,
  target: HTMLElement,
  options: {
    offset: number
    scrollX: boolean
    scrollY: boolean
    alignment?: ScrollLogicalPosition
    behavior: ScrollBehavior
  }
) {
  const { offset, scrollX, scrollY, alignment, behavior } = options
  const outer = container.getBoundingClientRect()
  const inner = target.getBoundingClientRect()

  function delta (start: number, size: number, extent: number, align: ScrollLogicalPosition) {
    if (align === 'center') return start - (extent - size) / 2
    if (align === 'end') return start - extent + size
    if (align === 'nearest') {
      if (start >= 0 && start + size <= extent) return 0
      if (start < 0 && start + size > extent) return 0
      return (start < 0 && size <= extent) || (start >= 0 && size > extent) ? start : start + size - extent
    }
    return start
  }

  const position: ScrollToOptions = { behavior }
  if (scrollY) {
    position.top = container.scrollTop + delta(
      inner.top - outer.top - container.clientTop, inner.height, container.clientHeight, alignment || 'center'
    ) + offset
  }
  if (scrollX) {
    position.left = container.scrollLeft + delta(
      inner.left - outer.left - container.clientLeft, inner.width, container.clientWidth, alignment || 'start'
    ) + offset
  }
  container.scrollTo(position)
}
