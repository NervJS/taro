import transform from '../src'
import { baseOptions } from './utils'

describe('wxs.ts测试', () => {
  test('wxs文件中的var regexp = getRegExp()转换为var regexp = new RegExp()', () => {
    const wxsCode = `var regexp = getRegExp();`
    baseOptions.sourcePath = '.wxs'
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toEqual('var regexp = new RegExp();')
  })
})