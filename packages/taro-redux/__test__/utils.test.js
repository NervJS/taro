const { isObject, mergeObjects } = require('../src/utils')

test('is object', () => {
  expect(isObject({ })).toBe(true)
  expect(isObject(null)).toBe(false)
  expect(isObject(1)).toBe(false)
  expect(isObject({ x: 1 })).toBe(true)
  expect(isObject(undefined)).toBe(false)
  expect(isObject('string')).toBe(false)
  expect(isObject([])).toBe(false)
  expect(isObject(() => {})).toBe(false)
})

test('merge objects', () => {
  expect(mergeObjects({ x: 1 }, { x: 2 })).toEqual({ x: 2 })
  expect(mergeObjects({ x: 1 }, { x: 2, b: 1 })).toEqual({ x: 2, b: 1 })
  expect(mergeObjects({ x: 1 }, { x: 2, b: { x: 1 } })).toEqual({ x: 2, b: { x: 1 } })
  expect(mergeObjects({ x: { a: 1 }, j: 'sds' }, { x: 2, b: { x: 1 } })).toEqual({ x: 2, j: 'sds', b: { x: 1 } })
  expect(mergeObjects({ x: { a: 1 }, j: 'sds' }, { x: { b: 2 }, b: { x: 1 } })).toEqual({ x: { a: 1, b: 2 }, j: 'sds', b: { x: 1 } })
})
