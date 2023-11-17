import transform from '../src'
import { baseOptions, removeBackslashesSerializer } from './utils'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('wxs.ts测试', () => {
  baseOptions.sourcePath = '.wxs'
  test('wxs文件中的var regexp = getRegExp()转换为var regexp = new RegExp()', () => {
    const wxsCode = `var regexp = getRegExp();`
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toEqual('var regexp = new RegExp();')
  })

  test('wxs标签中的getDate()转换为new Date()',()=>{
    const wxsCode = `
      module.exports = {
        date1:getDate(),
        //参数为数字
        date2:getDate(1500000000000),
        //参数为字符串
        date3:getDate('2017-7-14') 
      }
    `
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toMatchSnapshot()
  })
})