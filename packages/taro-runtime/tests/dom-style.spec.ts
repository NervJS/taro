import { beforeEach, describe, expect, it } from 'vitest'

import * as runtime from '../src/index'

describe('DOM Style', () => {
  const document = runtime.document

  global.document = runtime.document
  global.window = runtime.window

  describe('Style class', () => {
    let element: any
    let style: any

    beforeEach(() => {
      element = document.createElement('div')
      style = element.style
    })

    it('should initialize with empty values', () => {
      expect(style._usedStyleProp.size).toBe(0)
      expect(Object.keys(style._value).length).toBe(0)
    })

    it('should set and get style properties', () => {
      style.color = 'red'
      expect(style.color).toBe('red')
      expect(style._usedStyleProp.has('color')).toBe(true)
    })

    it('should handle CSS variables', () => {
      style.setProperty('--custom-color', 'blue')
      // CSS variables are handled differently in the implementation
      expect(style['--custom-color']).toBe('blue')
    })

    it('should remove properties when set to empty or null', () => {
      style.color = 'red'
      expect(style.color).toBe('red')

      style.color = ''
      expect(style.color).toBe('')
      expect(style._usedStyleProp.has('color')).toBe(false)
    })

    it('should handle cssText getter and setter', () => {
      style.color = 'red'
      style.fontSize = '16px'

      const cssText = style.cssText
      expect(cssText).toContain('color: red')
      expect(cssText).toContain('font-size: 16px')

      style.cssText = 'background: blue; margin: 10px;'
      expect(style.background).toBe('blue')
      expect(style.margin).toBe('10px')
    })

    it('should handle removeProperty', () => {
      style.color = 'red'
      style.fontSize = '16px'

      const removedValue = style.removeProperty('color')
      expect(removedValue).toBe('red')
      expect(style.color).toBe('')
    })

    it('should handle setProperty with priority', () => {
      style.setProperty('color', 'red', 'important')
      // Priority handling is not implemented in the current Style class
      expect(style.color).toBe('red')
    })

    it('should return empty string for non-existent properties', () => {
      // Non-existent properties return undefined, getPropertyValue returns empty string
      expect(style.nonExistentProperty).toBeUndefined()
      expect(style.getPropertyValue('nonExistentProperty')).toBe('')
    })

    it('should handle multiple property updates', () => {
      style.color = 'red'
      style.backgroundColor = 'blue'
      style.margin = '10px'
      style.padding = '5px'

      expect(style._usedStyleProp.size).toBe(4)
      expect(style.color).toBe('red')
      expect(style.backgroundColor).toBe('blue')
      expect(style.margin).toBe('10px')
      expect(style.padding).toBe('5px')
    })

    it('should not trigger update for same value', () => {
      style.color = 'red'
      const initialSize = style._usedStyleProp.size

      style.color = 'red' // Set same value
      expect(style._usedStyleProp.size).toBe(initialSize)
    })
  })
})
