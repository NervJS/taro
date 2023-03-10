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
 *  SOFTWARE.
 */

/**
 * Check whether a declaration is standard
 */
export function isStandardSyntaxDeclaration (decl /*: Object */) /*: boolean */ {
  const prop = decl.prop
  const parent = decl.parent

  // Declarations belong in a declaration block

  if (parent.type === 'root') {
    return false
  }

  // Sass var (e.g. $var: x), nested list (e.g. $list: (x)) or nested map (e.g. $map: (key:value))
  if (prop[0] === '$') {
    return false
  }

  // Less var (e.g. @var: x), but exclude variable interpolation (e.g. @{var})
  if (prop[0] === '@' && prop[1] !== '{') {
    return false
  }

  // Sass nested properties (e.g. border: { style: solid; color: red; })
  if (
    parent.selector &&
    parent.selector[parent.selector.length - 1] === ':' &&
    parent.selector.substring(0, 2) !== '--'
  ) {
    return false
  }

  return true
}
