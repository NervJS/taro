export const reserveKeyWords = new Set([
  'break',
  'case',
  'catch',
  'continue',
  'default',
  'delete',
  'do',
  'else',
  'finally',
  'for',
  'function',
  'if',
  'in',
  'instanceof',
  'new',
  'return',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'abstract',
  'boolean',
  'byte',
  'char',
  'class',
  'const',
  'debugger',
  'double',
  'enum',
  'export',
  'extends',
  'final',
  'float',
  'goto',
  'implements',
  'import',
  'int',
  'interface',
  'long',
  'native',
  'package',
  'private',
  'protected',
  'public',
  'short',
  'static',
  'super',
  'synchronized',
  'throws',
  'transient'
])

interface ITemplateSyntax {
  IF: string
  ELSE_IF: string
  FOR: string
  FOR_ITEM: string
  FOR_ITEMS: string
  FOR_INDEX: string
  KEY: string
  ELSE: string
}

export const wxTemplateSyntaxPrefix = 'wx:'
export const jdTemplateSyntaxPrefix = 'jd:'
export const wxTemplateSyntaxThroughPrefix = 'wx-'
export const jdTemplateSyntaxThroughPrefix = 'jd-'

export const wxTemplateSyntax: ITemplateSyntax = {
  IF: `wx:if`,
  ELSE_IF: 'wx:elif',
  FOR: 'wx:for',
  FOR_ITEM: 'wx:for-item',
  FOR_ITEMS: 'wx:for-items',
  FOR_INDEX: 'wx:for-index',
  KEY: 'wx:key',
  ELSE: 'wx:else'
}

export const jdTemplateSyntax: ITemplateSyntax = {
  IF: 'jd:if',
  ELSE_IF: 'jd:elif',
  FOR: 'jd:for',
  FOR_ITEM: 'jd:for-item',
  FOR_ITEMS: 'jd:for-items',
  FOR_INDEX: 'jd:for-index',
  KEY: 'jd:key',
  ELSE: 'jd:else'
}

export let templateSyntaxPrefix: string
export let templateSyntaxThroughPrefix: string
export let templateSyntax: ITemplateSyntax

export function setTemplateType (type: string) {
  if (type === 'jd') {
    templateSyntaxPrefix = jdTemplateSyntaxPrefix
    templateSyntax = jdTemplateSyntax
    templateSyntaxThroughPrefix = jdTemplateSyntaxThroughPrefix
  } else {
    templateSyntaxPrefix = wxTemplateSyntaxPrefix
    templateSyntax = wxTemplateSyntax
    templateSyntaxThroughPrefix = wxTemplateSyntaxThroughPrefix
  }
}
