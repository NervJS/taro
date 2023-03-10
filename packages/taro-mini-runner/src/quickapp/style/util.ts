/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
