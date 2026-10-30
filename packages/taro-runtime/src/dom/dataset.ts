import { toCamelCase } from '@tarojs/shared'

import type { TaroElement } from './element'

// Object property order does not track writes to existing attributes.
const attributeOrder = new WeakMap<TaroElement, Set<string>>()

export function recordDatasetAttribute (element: TaroElement, name: string) {
  let order = attributeOrder.get(element)
  if (!order) {
    order = new Set()
    attributeOrder.set(element, order)
  }
  order.delete(name)
  order.add(name)
}

export function removeDatasetAttribute (element: TaroElement, name: string) {
  const key = toCamelCase(name.replace(/^data-/, ''))
  const order = attributeOrder.get(element)
  order?.delete(name)
  let remainingAttribute: string | undefined
  order?.forEach(attribute => {
    if (toCamelCase(attribute.replace(/^data-/, '')) === key) {
      remainingAttribute = attribute
    }
  })
  if (remainingAttribute !== undefined) {
    element.dataset[key] = element.props[remainingAttribute]
  } else {
    delete element.dataset[key]
  }
  if (order?.size === 0) attributeOrder.delete(element)
}

export function copyDatasetAttributeOrder (source: TaroElement, target: TaroElement) {
  const order = attributeOrder.get(source)
  if (order) attributeOrder.set(target, new Set(order))
}
