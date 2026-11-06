import { describe, expect, test } from 'vitest'

import createFilter, { createFilterWithCompileOptions } from '../../src/utils/createFilter'

describe('createFilter', () => {
  test.each(['g', 'y', 'gy'])('repeated include matching with /%s is deterministic', flags => {
    const filter = createFilter([new RegExp('.*\\.tsx$', flags)], [])
    expect([filter('/src/page.tsx'), filter('/src/page.tsx'), filter('/src/other.tsx')]).toEqual([true, true, true])
    expect(filter('/src/page.css')).toBe(false)
  })

  test.each(['g', 'y', 'gy'])('repeated exclude matching with /%s is deterministic', flags => {
    const filter = createFilter([], [new RegExp('.*\\.tsx$', flags)])
    expect([filter('/src/page.tsx'), filter('/src/page.tsx'), filter('/src/other.tsx')]).toEqual([false, false, false])
    expect(filter('/src/page.css')).toBe(true)
  })

  test('ignores an existing regex cursor and keeps exclusions ahead of inclusions', () => {
    const include = /.*\.tsx$/g
    const exclude = /.*excluded\.tsx$/y
    include.lastIndex = 100
    exclude.lastIndex = 100
    const filter = createFilter([include], [exclude])
    expect(filter('/src/excluded.tsx')).toBe(false)
    expect(filter('/src/page.tsx')).toBe(true)
    expect(filter('/src/excluded.tsx')).toBe(false)
  })

  test('applies stateful compile include/exclude rules consistently', () => {
    const filter = createFilterWithCompileOptions({ include: [/.*\.tsx$/g], exclude: [/.*vendor.*/g] })
    expect(filter('/src/page.tsx')).toBe(true)
    expect(filter('/src/page.tsx')).toBe(true)
    expect(filter('/vendor/page.tsx')).toBe(false)
    expect(filter('/vendor/page.tsx')).toBe(false)
  })

  test('preserves glob matching and Windows path normalization', () => {
    const filter = createFilter(['**/*.tsx'], ['**/vendor/**'])
    expect(filter('C:\\src\\page.tsx')).toBe(true)
    expect(filter('C:\\src\\vendor\\page.tsx')).toBe(false)
    expect(filter('/src/page.css')).toBe(false)
    expect(filter(null)).toBe(false)
  })
})
