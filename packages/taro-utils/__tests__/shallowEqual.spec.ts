import shallowEqual from '../src/shallow-equal'

describe('shallowEqual', () => {
  test('test shallow comparision', () => {
    const base = { a: 1, b: 2 }
    expect(shallowEqual(base, { a: 1, b: 2 })).toBe(true)
    expect(shallowEqual(base, { a: 1, b: 3 })).toBe(false)
    expect(shallowEqual(base, { a: 1, b: 2, c: 3 })).toBe(false)
    expect(shallowEqual(base, { a: 1 })).toBe(false)
  })

  test('not support deep comparision', () => {
    const base = { a: { b: 2 } };
    expect(shallowEqual(base, { a: { b: 2 } })).toBe(false)
  })

  test('null === null', () => {
    expect(shallowEqual(null, null)).toBe(true)
  })

  test('null !== {}', () => {
    expect(shallowEqual(null, {})).toBe(false)
    expect(shallowEqual({}, null)).toBe(false)
  })

  test('undefined === undefined', () => {
    expect(shallowEqual(undefined, undefined)).toBe(true)
  })

  test('undefined !== {}', () => {
    expect(shallowEqual(undefined, {})).toBe(false)
    expect(shallowEqual({}, undefined)).toBe(false)
  })
})
