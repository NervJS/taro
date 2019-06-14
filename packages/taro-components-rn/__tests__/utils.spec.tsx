import { StyleSheet } from 'react-native'
import utils from '../src/utils'

describe('Utils', () => {
  describe('omit should works well', () => {
    it('functional test', () => {
      const obj = { a: 'miao', b: 'miao2', c: 'miao3' }
      expect(utils.omit(obj, ['a'])).not.toHaveProperty('a')
    })

    it('default parameter', () => {
      expect(utils.omit()).toEqual({})
    })
  })

  describe('dismemberStyle should works well', () => {
    it('functional test', () => {
      const result = utils.dismemberStyle({
        alignSelf: 'center',
        flex: 1,
        // @ts-ignore
        unknownProperty: 'unknownProperty'
      })
      // @todo so much properties!!!
      expect(result).toHaveProperty('wrapperStyle.alignSelf')
      expect(result).toHaveProperty('innerStyle.flex')
      expect(result).toHaveProperty('innerStyle.unknownProperty')
    })

    it('default parameter', () => {
      expect(utils.dismemberStyle()).toEqual({
        wrapperStyle: {},
        innerStyle: {}
      })
    })
  })

  describe('parseStyles should works well', () => {
    it('functional test', () => {
      const result = utils.parseStyles('line-height: 60px; color: red;')
      expect(result).toEqual({
        lineHeight: '60px',
        color: 'red'
      })
    })

    it('default parameter', () => {
      expect(utils.parseStyles()).toEqual({})
    })
  })
})
