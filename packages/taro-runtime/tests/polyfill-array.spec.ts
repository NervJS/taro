import { afterEach, beforeEach, describe, expect, it } from 'vitest'
/* eslint-disable */
describe('Polyfill Array', () => {
  let originalArrayIncludes: typeof Array.prototype.includes | undefined
  let originalArrayFind: typeof Array.prototype.find | undefined
  let originalArrayFindIndex: typeof Array.prototype.findIndex | undefined

  beforeEach(() => {
    // Save original methods
    originalArrayIncludes = Array.prototype.includes
    originalArrayFind = Array.prototype.find
    originalArrayFindIndex = Array.prototype.findIndex
  })

  afterEach(() => {
    // Always restore original methods after each test
    if (originalArrayIncludes) Array.prototype.includes = originalArrayIncludes
    if (originalArrayFind) Array.prototype.find = originalArrayFind
    if (originalArrayFindIndex) Array.prototype.findIndex = originalArrayFindIndex
  })

  it('should polyfill Array.prototype.includes when not available', async () => {
    // Test that polyfill works by checking if it adds the method when missing
    const { handleArrayIncludesPolyfill } = await import('../src/polyfill/array')

    // Remove includes temporarily
    ;(Array.prototype as any).includes = undefined

    // Apply polyfill
    handleArrayIncludesPolyfill()

    // Verify polyfill was applied
    expect(typeof Array.prototype.includes).toBe('function')

    // Test functionality - create new array after polyfill is applied
    const testArray = [1, 2, 3, 'test']
    expect(testArray.includes(2)).toBe(true)
    expect(testArray.includes(4)).toBe(false)
    expect(testArray.includes('test')).toBe(true)
    expect(testArray.includes('test', 4)).toBe(false)
  })

  it('should polyfill Array.prototype.find', async () => {
    // Test that polyfill works by checking if it adds the method when missing
    const { handleArrayFindPolyfill } = await import('../src/polyfill/array')

    // Remove find temporarily
    ;(Array.prototype as any).find = undefined

    // Apply polyfill
    handleArrayFindPolyfill()

    // Verify polyfill was applied
    expect(typeof Array.prototype.find).toBe('function')

    const arr = [1, 2, 3, 4, 5]

    const found = arr.find(x => x > 3)
    expect(found).toBe(4)

    const notFound = arr.find(x => x > 10)
    expect(notFound).toBeUndefined()

    // Test with callback that has index parameter
    const foundWithIndex = arr.find((x, i) => i === 2)
    expect(foundWithIndex).toBe(3)
  })

  it('should polyfill Array.prototype.findIndex', async () => {
    // Test that polyfill works by checking if it adds the method when missing
    const { handleArrayFindIndexPolyfill } = await import('../src/polyfill/array')

    // Remove findIndex temporarily
    ;(Array.prototype as any).findIndex = undefined

    // Apply polyfill
    handleArrayFindIndexPolyfill()

    // Verify polyfill was applied
    expect(typeof Array.prototype.findIndex).toBe('function')

    const arr = [1, 2, 3, 4, 5]

    const foundIndex = arr.findIndex(x => x > 3)
    expect(foundIndex).toBe(3)

    const notFoundIndex = arr.findIndex(x => x > 10)
    expect(notFoundIndex).toBe(-1)

    // Test with callback that has index parameter
    const foundIndexWithIndex = arr.findIndex((x, i) => i === 2 && x === 3)
    expect(foundIndexWithIndex).toBe(2)
  })

  it('should handle edge cases in polyfills', async () => {
    // Import and directly call polyfills
    const { handleArrayIncludesPolyfill, handleArrayFindPolyfill, handleArrayFindIndexPolyfill } = await import('../src/polyfill/array')

    // Remove native methods to test polyfill
    ;(Array.prototype as any).includes = undefined
    ;(Array.prototype as any).find = undefined
    ;(Array.prototype as any).findIndex = undefined

    handleArrayIncludesPolyfill()
    handleArrayFindPolyfill()
    handleArrayFindIndexPolyfill()

    const arr = [1, null, undefined, 0, false, '']

    // Test includes with special values
    expect(arr.includes(null)).toBe(true)
    expect(arr.includes(undefined)).toBe(true)
    expect(arr.includes(0)).toBe(true)
    expect(arr.includes(false)).toBe(true)
    expect(arr.includes('')).toBe(true)

    // Test find with special values
    expect(arr.find(x => x === null)).toBe(null)
    expect(arr.find(x => x === undefined)).toBe(undefined)
    expect(arr.find(x => x === 0)).toBe(0)
    expect(arr.find(x => x === false)).toBe(false)
    expect(arr.find(x => x === '')).toBe('')

    // Test findIndex with special values
    expect(arr.findIndex(x => x === null)).toBe(1)
    expect(arr.findIndex(x => x === undefined)).toBe(2)
    expect(arr.findIndex(x => x === 0)).toBe(3)
    expect(arr.findIndex(x => x === false)).toBe(4)
    expect(arr.findIndex(x => x === '')).toBe(5)
  })
})
