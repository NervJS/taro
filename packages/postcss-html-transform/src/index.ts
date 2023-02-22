/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { Rule } from 'postcss'

const htmlTags = ['html', 'body', 'a', 'audio', 'button', 'canvas', 'form', 'iframe', 'img', 'input', 'label', 'progress', 'select', 'slot', 'textarea', 'video', 'abbr', 'area', 'b', 'bdi', 'big', 'br', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'map', 'mark', 'meter', 'output', 'picture', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'td', 'template', 'th', 'time', 'tt', 'u', 'var', 'wbr', 'address', 'article', 'aside', 'blockquote', 'caption', 'dd', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'legend', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'ul', 'svg']
const miniAppTags = ['cover-image', 'cover-view', 'match-media', 'movable-area', 'movable-view', 'page-container', 'scroll-view', 'share-element', 'swiper', 'swiper-item', 'view', 'icon', 'progress', 'rich-text', 'text', 'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'keyboard-accessory', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea', 'functional-page-navigator', 'navigator', 'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video', 'voip-room', 'map', 'canvas', 'web-view', 'ad', 'ad-custom', 'official-account', 'open-data', 'navigation-bar', 'page-meta']
const tags2Rgx = (tags: string[] = []) => new RegExp(`(^| |\\+|,|~|>|\\n)(${tags.join('|')})\\b(?=$| |\\.|\\+|,|~|:|\\[)`, 'g')

const postcssHtmlTransform = (options: any = {}) => {
  let selectorFilter
  let walkRules
  switch (options.platform) {
    case 'h5': {
      selectorFilter = tags2Rgx(miniAppTags)
      walkRules = (rule: Rule) => {
        rule.selector = rule.selector.replace(selectorFilter, '$1taro-$2-core')
      }
      break
    }
    case 'rn': {
      break
    }
    case 'quickapp': {
      break
    }
    default: {
      // mini-program
      const selector = tags2Rgx(htmlTags)
      walkRules = (rule: Rule) => {
        if (/(^| )\*(?![=/*])/.test(rule.selector)) {
          rule.remove()
          return
        }
        rule.selector = rule.selector.replace(selector, '$1.h5-$2')
      }
    }
  }
  return {
    postcssPlugin: 'postcss-html-transform',
    Rule (rule) {
      if (typeof walkRules === 'function') {
        if (selectorFilter && selectorFilter.test(rule.prop)) {
          walkRules(rule)
        } else {
          walkRules(rule)
        }
      }
    },
    Declaration (decl) {
      if (options?.removeCursorStyle) {
        if (decl.prop === 'cursor') {
          decl.remove()
        }
      }
    }
  }
}

postcssHtmlTransform.postcss = true
export default postcssHtmlTransform
