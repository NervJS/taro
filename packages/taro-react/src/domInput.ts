import { FormElement, TaroElement } from '@tarojs/runtime'

import { Props } from './props'

export function restoreControlledState (element: TaroElement, props: Props) {
  updateWrapper(element, props)
  updateNamedCousins(element, props)
}

function updateNamedCousins (rootNode, props) {
  const name = props.name

  if (props.type === 'radio' && name != null) {
    console.warn('radio updateNamedCousins 未实现', rootNode, props)
  }
}


export function updateChecked (element: TaroElement, props: Props) {
  const node = element
  const checked = props.checked

  if (checked != null) {
    console.warn('updateCheck 未实现', node)
  }
}

export function getToStringValue (value: any) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return value
    case 'object':
      return value
    default:
      return ''
  }
}

export function toString (value): string {
  return '' + value
}


export function updateWrapper (element: TaroElement, props: Props) {
  const node = element as FormElement

  updateChecked(element, props)

  const value = getToStringValue(props.value)
  const type = props.type as string

  setNodeValue(node, value, type)
}

export function setNodeValue (node: FormElement, value, type = 'string') {
  if (value != null) {
    if (type === 'number') {
      if (
        (value === 0 && node.value === '') ||
        // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        node.value != value
      ) {
        node.value = toString(value)
      }
    } else if (node.value !== toString(value)) {
      node.value = toString(value)
    }
  } else if (type === 'submit' || type === 'reset') {
    // Submit/reset inputs need the attribute removed completely to avoid
    // blank-text buttons.
    node.removeAttribute('value')
  }
}