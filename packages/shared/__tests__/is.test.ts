import { isNumber } from '../src/is'

describe('is', () => {
  it('isNumber', () => {
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber('foo')).toBe(false)
    expect(isNumber([])).toBe(false)
    expect(isNumber([1, 2, '3'])).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber({})).toBe(false)
    expect(isNumber(/test/)).toBe(false)
    expect(isNumber(new RegExp(''))).toBe(false)
    expect(isNumber(new Date())).toBe(false)
    expect(isNumber(function foo () {})).toBe(false)
    expect(isNumber({ foo: 'bar' })).toBe(false)
    expect(isNumber(parseInt('A', 10))).toBe(false)
    expect(isNumber(1 / 0)).toBe(false)
    expect(isNumber(-1 / 0)).toBe(false)

    expect(isNumber(5)).toBe(true)
  })
})
