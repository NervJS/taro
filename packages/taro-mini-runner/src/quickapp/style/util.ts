export const comment = (msg, url) => 'Taro comment: ' + msg + '.' + (url ? '[兼容写法参考](' + url + ')' : '')
/**
 * 在rule中删除指定declaration
 */
export const removeDeclaration = (declaration, rule) => rule.declarations.splice(rule.declarations.findIndex(v => v.property === declaration.property && v.value === declaration.value), 1)
/**
 * 在rule中增加一条declaration
 */
export const addDeclaration = (property, value, rule) => rule.declarations.push({
  type: 'declaration',
  property,
  value
})
/**
 * 在rule中增加一条comment
 */
export const addComment = (property, value, rule) => rule.declarations.push({
  type: 'comment',
  comment: `${property}:${value}; ${comment('unsupported style', 'https://doc.quickapp.cn/widgets/common-styles.html')}`
})

export const getDeclarationValue = (property, rule) => {
  const declarations = rule.declarations.filter(declaration => declaration.property === property)
  return (declarations.length && declarations[0]) || false
}
