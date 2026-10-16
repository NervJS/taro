import { describe, expect, test } from 'vitest'

import { document, Style } from '../src/index'

function createStyle () {
  return new Style(document.createElement('view'))
}

describe('style property names', () => {
  test.each(['-webkit-line-clamp', '-moz-user-select', '--theme-color'])('reads and removes the key written by setProperty: %s', (name) => {
    const style = createStyle()
    style.setProperty(name, 'initial')

    expect(style.getPropertyValue(name)).toBe('initial')
    expect(style.cssText).toBe(`${name}: initial;`)
    expect(style.removeProperty(name)).toBe('initial')
    expect(style.getPropertyValue(name)).toBe('')
    expect(style.cssText).toBe('')
    expect(style.removeProperty(name)).toBe('')
  })

  test.each([null, undefined])('clears a vendor-prefixed property through setProperty with %s', (value) => {
    const style = createStyle()
    style.setProperty('-webkit-line-clamp', '2')
    style.setProperty('-webkit-line-clamp', value)

    expect(style.getPropertyValue('-webkit-line-clamp')).toBe('')
    expect(style.cssText).toBe('')
    expect(style._usedStyleProp.size).toBe(0)
  })

  test('clears vendor-prefixed properties when cssText is emptied', () => {
    const style = createStyle()
    style.cssText = '-webkit-line-clamp: 2; -moz-user-select: none; --theme-color: red; color: blue;'
    style.cssText = ''

    expect(style.cssText).toBe('')
    expect(style._usedStyleProp.size).toBe(0)
    expect(style.getPropertyValue('-webkit-line-clamp')).toBe('')
    expect(style.getPropertyValue('-moz-user-select')).toBe('')
  })

  test('replaces vendor-prefixed properties through cssText', () => {
    const style = createStyle()
    style.cssText = '-webkit-line-clamp: 2; -moz-user-select: none; color: blue;'
    style.cssText = 'color: red;'

    expect(style.cssText).toBe('color: red;')
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.getPropertyValue('-webkit-line-clamp')).toBe('')
    expect(style.getPropertyValue('-moz-user-select')).toBe('')
  })

  test('normalizes ordinary dashed and camelCase names to the same key', () => {
    const style = createStyle()
    style.setProperty('margin-top', '4px')

    expect(style.getPropertyValue('margin-top')).toBe('4px')
    expect(style.getPropertyValue('marginTop')).toBe('4px')
    expect(style.removeProperty('marginTop')).toBe('4px')
    expect(style.cssText).toBe('')
    style.setProperty('marginTop', '8px')
    expect(style.removeProperty('margin-top')).toBe('8px')
    expect(style.cssText).toBe('')
  })
})
