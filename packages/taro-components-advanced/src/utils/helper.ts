// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
export const defaultItemKey = (index: number, _itemData?: unknown) => index

export function getOffsetForIndexAndAlignment ({
  align = 'auto',
  containerSize = 0,
  currentOffset = 0,
  scrollSize = 0,
  slideSize = 0,
  targetOffset = 0,
}) {
  const lastItemOffset = Math.max(0, scrollSize - containerSize)
  const maxOffset = Math.min(lastItemOffset, targetOffset)
  const minOffset = Math.max(0, targetOffset - containerSize + slideSize)

  if (align === 'smart') {
    if (currentOffset >= minOffset - containerSize && currentOffset <= maxOffset + containerSize) {
      align = 'auto'
    } else {
      align = 'center'
    }
  }

  switch (align) {
    case 'start':
      return maxOffset

    case 'end':
      return minOffset

    case 'center':
    {
      // "Centered" offset is usually the average of the min and max.
      // But near the edges of the list, this doesn't hold true.
      const middleOffset = Math.round(minOffset + (maxOffset - minOffset) / 2)

      if (middleOffset < Math.ceil(containerSize / 2)) {
        return 0 // near the beginning
      } else if (middleOffset > lastItemOffset + Math.floor(containerSize / 2)) {
        return lastItemOffset // near the end
      } else {
        return middleOffset
      }
    }

    case 'auto':
    default:
      if (currentOffset >= minOffset && currentOffset <= maxOffset) {
        return currentOffset
      } else if (currentOffset < minOffset) {
        return minOffset
      } else {
        return maxOffset
      }
  }
}
