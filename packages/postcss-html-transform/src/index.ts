const postcss = require('postcss')

export default postcss.plugin('postcss-html-transform', plugin)

const htmlTags = ['html', 'body', 'a', 'audio', 'button', 'canvas', 'form', 'iframe', 'img', 'input', 'label', 'progress', 'select', 'slot', 'textarea', 'video', 'abbr', 'area', 'b', 'bdi', 'big', 'br', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'map', 'mark', 'meter', 'output', 'picture', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'td', 'template', 'th', 'time', 'tt', 'u', 'var', 'wbr', 'address', 'article', 'aside', 'blockquote', 'caption', 'dd', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'legend', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'ul', 'svg']
const tagsCombine = htmlTags.join('|')
const reg = new RegExp(`(^| |\\+|,|~|>|\\n)(${tagsCombine})\\b(?=$| |\\.|\\+|,|~|:|\\[)`, 'g')

function plugin (_opts) {
  return function (root) {
    root.walkRules(function (rule) {
      if (/(^| )\*(?![=/*])/.test(rule)) {
        rule.remove()
        return
      }
      rule.selector = rule.selector.replace(reg, '$1.h5-$2')
    })
    root.walkDecls(function (decl) {
      if (decl.prop === 'cursor') {
        decl.remove()
      }
    })
  }
}
