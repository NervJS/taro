import type { IProps } from '../preset'
import type { IState } from './list'

let devWarningsDirection = null
let devWarningsTagName = null

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined' && typeof window.WeakSet !== 'undefined') {
    devWarningsDirection =
      /* #__PURE__ */
      new WeakSet()
    devWarningsTagName =
      /* #__PURE__ */
      new WeakSet()
  }
}

export const validateListProps = ({
  item,
  direction,
  height,
  layout,
  itemTagName,
  innerTagName,
  outerTagName,
  width,
  itemSize
}: IProps, {
  instance,
}: IState) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!['number', 'function'].includes(typeof itemSize)) {
      throw Error('An invalid "itemSize" prop has been specified. ' + 'Value should be a number or function. ' + `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    if (innerTagName != null || outerTagName != null || itemTagName != null) {
      if (devWarningsTagName && !devWarningsTagName.has(instance)) {
        devWarningsTagName.add(instance)
        console.warn('The itemTagName、innerTagName and outerTagName props have been deprecated. ' + 'Please use the itemElementType、innerElementType and outerElementType props instead.')
      }
    }

    const isHorizontal = direction as string === 'horizontal' || layout === 'horizontal'

    switch (direction as string) {
      case 'horizontal':
      case 'vertical':
        if (devWarningsDirection && !devWarningsDirection.has(instance)) {
          devWarningsDirection.add(instance)
          console.warn('The direction prop should be either "ltr" (default) or "rtl". ' + 'Please use the layout prop to specify "vertical" (default) or "horizontal" orientation.')
        }

        break

      case 'ltr':
      case 'rtl':
        // Valid values
        break

      default:
        throw Error('An invalid "direction" prop has been specified. ' + 'Value should be either "ltr" or "rtl". ' + `"${direction}" was specified.`)
    }

    switch (layout) {
      case 'horizontal':
      case 'vertical':
        // Valid values
        break

      default:
        throw Error('An invalid "layout" prop has been specified. ' + 'Value should be either "horizontal" or "vertical". ' + `"${layout}" was specified.`)
    }

    if (item == null) {
      throw Error('An invalid "item" prop has been specified. ' + 'Value should be a React component. ' + `"${item === null ? 'null' : typeof item}" was specified.`)
    }

    if (isHorizontal && typeof width !== 'number') {
      throw Error('An invalid "width" prop has been specified. ' + 'Horizontal lists must specify a number for width. ' + `"${width === null ? 'null' : typeof width}" was specified.`)
    } else if (!isHorizontal && typeof height !== 'number') {
      throw Error('An invalid "height" prop has been specified. ' + 'Vertical lists must specify a number for height. ' + `"${height === null ? 'null' : typeof height}" was specified.`)
    }
  }

  return null
}
