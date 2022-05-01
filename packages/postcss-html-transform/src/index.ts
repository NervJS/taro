// const postcss = require('postcss')
const htmlTags = ['html', 'body', 'a', 'audio', 'button', 'canvas', 'form', 'iframe', 'img', 'input', 'label', 'progress', 'select', 'slot', 'textarea', 'video', 'abbr', 'area', 'b', 'bdi', 'big', 'br', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'map', 'mark', 'meter', 'output', 'picture', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'td', 'template', 'th', 'time', 'tt', 'u', 'var', 'wbr', 'address', 'article', 'aside', 'blockquote', 'caption', 'dd', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'legend', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'ul', 'svg']
const tagsCombine = htmlTags.join('|')
const reg = new RegExp(`(^| |\\+|,|~|>|\\n)(${tagsCombine})\\b(?=$| |\\.|\\+|,|~|:|\\[)`, 'g')

module.exports = (_opts) => {
  return {
    postcssPlugin: 'postcss-html-transform',
    AtRule (rule) {
      if (/(^| )\*(?![=/*])/.test(rule.selector)) {
        rule.remove()
        return
      }
      rule.selector = rule.selector.replace(reg, '$1.h5-$2')
    },
    Declaration (decl) {
      let removeCursorStyle = true
      if (typeof _opts?.removeCursorStyle === 'boolean') {
        removeCursorStyle = _opts.removeCursorStyle
      }
      if (removeCursorStyle) {
        if (decl.prop === 'cursor') {
          decl.remove()
        }
      }
    }
    // Once (root) {
    //   root.walkRules(function (rule) {
    //     if (/(^| )\*(?![=/*])/.test(rule.selector)) {
    //       rule.remove()
    //       return
    //     }
    //     rule.selector = rule.selector.replace(reg, '$1.h5-$2')
    //   })
    //   let removeCursorStyle = true
    //   if (typeof _opts?.removeCursorStyle === 'boolean') {
    //     removeCursorStyle = _opts.removeCursorStyle
    //   }
    //   if (removeCursorStyle) {
    //     root.walkDecls(function (decl) {
    //       if (decl.prop === 'cursor') {
    //         decl.remove()
    //       }
    //     })
    //   }
    // }
  }
}

module.exports.postcss = true
