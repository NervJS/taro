import { omit, dismemberStyle, parseStyles } from '../utils'

describe('Utils', () => {
  describe('omit should works well', () => {
    it('functional test', () => {
      const obj = { a: 'miao', b: 'miao2', c: 'miao3' }
      expect(omit(obj, ['a'])).not.toHaveProperty('a')
    })

    it('default parameter', () => {
      expect(omit()).toEqual({})
    })
  })

  describe('dismemberStyle should works well', () => {
    it('functional test', () => {
      const result = dismemberStyle({
        alignSelf: 'center',
        flex: 1,
        unknownProperty: 'unknownProperty'
      } as any)
      // @todo so much properties!!!
      expect(result).toHaveProperty('wrapperStyle.alignSelf')
      expect(result).toHaveProperty('innerStyle.flex')
      expect(result).toHaveProperty('innerStyle.unknownProperty')
    })

    it('default parameter', () => {
      expect(dismemberStyle()).toEqual({
        wrapperStyle: {},
        innerStyle: {}
      })
    })
  })

  describe('parseStyles should works well', () => {
    it('functional test', () => {
      const result = parseStyles('line-height: 60px; color: red;')
      expect(result).toEqual({
        lineHeight: '60px',
        color: 'red'
      })
    })

    it('default parameter', () => {
      expect(parseStyles()).toEqual({})
    })
  })
})
