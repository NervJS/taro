import { normalizePath } from '@tarojs/helper'

export function getHtmlScript (entryScript: string, pxtransformOption): string {
  let htmlScript = ''
  const options = pxtransformOption?.config || {}
  const max = options?.maxRootSize ?? 40
  const min = options?.minRootSize ?? 20
  const baseFontSize = options?.baseFontSize || (min > 1 ? min : 20)
  const designWidth = ((input) =>
    typeof options.designWidth === 'function' ? options.designWidth(input) : options.designWidth)(baseFontSize)
  const rootValue = (baseFontSize / options.deviceRatio[designWidth]) * 2

  if ((options?.targetUnit ?? 'rem') === 'rem') {
    htmlScript = `<script>!function(n){function f(){var e=n.document.documentElement,r=e.getBoundingClientRect(),width=r.width,height=r.height,arr=[width,height].filter(function(value){return Boolean(value)}),w=Math.min.apply(Math,arr),x=${rootValue}*w/${designWidth};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"}; n.addEventListener("resize",(function(){f()})),f()}(window);</script>\n`
  }
  htmlScript += `  <script type="module" src="${normalizePath(entryScript)}"></script>`
  return htmlScript
}
