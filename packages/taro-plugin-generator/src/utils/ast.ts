import * as t from '@babel/types'

/**
 * 确保对象表达式中存在某个嵌套属性，并且其值为 ObjectExpression
 * @param rootObj 当前 ObjectExpression
 * @param keys 属性路径，如 ["compile"] 或 ["compile", "include"]
 * @returns 最终那个 ObjectExpression 节点（已经创建好的）
 */
export function ensureNestedObjectProperty(rootObj: t.ObjectExpression, keys: string[]): t.ObjectExpression {
  let current = rootObj

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    const prop = current.properties.find((p) => t.isObjectProperty(p) && t.isIdentifier(p.key, { name: key })) as
      | t.ObjectProperty
      | undefined

    if (!prop) {
      const newObj = t.objectExpression([])
      current.properties.push(t.objectProperty(t.identifier(key), newObj))
      current = newObj
    } else if (!t.isObjectExpression(prop.value)) {
      const newObj = t.objectExpression([])
      prop.value = newObj
      current = newObj
    } else {
      current = prop.value
    }
  }

  return current
}
