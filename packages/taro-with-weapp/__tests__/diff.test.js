import { diff } from '../src/diff'

describe('diff', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  it('{ k1: "ab" } = { k1: "ab" }', () => {
    expect(diff({ k1: 'ab' }, { k1: 'ab' })).toEqual({})
  })
  it('{ k1: "ab" } ≠ { k1: "abc" }', () => {
    expect(diff({ k1: 'ab' }, { k1: 'abc' })).toEqual({ k1: 'ab' })
  })
  it('{ k2: { k21: "ab" } } = { k2: { k21: "ab" } }', () => {
    expect(diff({ k2: { k21: 'ab' } }, { k2: { k21: 'ab' } })).toEqual({})
  })
  it('{ k2: { k21: "ab" } } ≠ { k2: { k21: "abc" } }', () => {
    expect(diff({ k2: { k21: 'ab' } }, { k2: { k21: 'abc' } })).toEqual({ 'k2.k21': 'ab' })
  })
  it('{ k1: "ab", k2: { k21: "ab" } } = { k1: "ab", k2: { k21: "ab" } }', () => {
    expect(diff({ k1: 'ab', k2: { k21: 'ab' } }, { k1: 'ab', k2: { k21: 'ab' } })).toEqual({})
  })
  it('{ k1: "ab", k2: { k21: "ab" } } ≠ { k1: "ab", k2: { k21: "ab" } }', () => {
    expect(diff({ k1: 'ab', k2: { k21: 'ab' } }, { k1: 'abc', k2: { k21: 'abc' } })).toEqual({ k1: 'ab', 'k2.k21': 'ab' })
  })
  it('Result should be {}', () => {
    const a = {}
    const b = {}
    let i = 0
    const s = [a, b]
    while (i++ < 100) {
      s[0][i] = {}
      s[1][i] = {}
      s[0] = s[0][i]
      s[1] = s[1][i]
    }
    expect(diff(a, b)).toEqual({})
  })
  it('Result should be { "a": "1" }', () => {
    const a = {}
    const b = {}
    let i = 0
    const s = [a, b]
    while (i++ < 10000) {
      s[0][i] = {}
      s[1][i] = {}
      s[0] = s[0][i]
      s[1] = s[1][i]
    }
    a.a = '1'
    expect(diff(a, b)).toEqual({ a: '1' })
  })
})
