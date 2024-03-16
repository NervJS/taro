import transform from '../src'
import { baseOptions, removeBackslashesSerializer } from './utils'

expect.addSnapshotSerializer(removeBackslashesSerializer)

let logFileMap = new Map()
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn((path,content) => {
    logFileMap.set(path, content)
  }),
}))

describe('wxs.ts测试', () => {
  afterEach(() => {
    logFileMap.clear()
  })

  baseOptions.sourcePath = '.wxs'
  test('wxs文件中的var regexp = getRegExp()转换为var regexp = new RegExp()', () => {
    const wxsCode = `var regexp = getRegExp();`
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toEqual('var regexp = new RegExp();')
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 只有一个参数', () => { 
    const wxsCode = `var regexp = getRegExp('x');`
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toEqual(`var regexp = new RegExp("x");`)
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 有两个参数', () => { 
    const wxsCode = `var regexp = getRegExp("x", "img");`
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toEqual(`var regexp = new RegExp("x", "img");`)
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 有一个参数，参数为变量', () => { 
    const wxsCode = `var regexp = getRegExp(param);`
    expect(() => transform({...baseOptions, code: wxsCode})).toThrow() 
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 有两个参数，其中某个参数为变量', () => { 
    const wxsCode = `var regexp = getRegExp(param, "img");`
    expect(() => transform({...baseOptions, code: wxsCode})).toThrow() 
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 有一个参数，参数为非字符串', () => { 
    const wxsCode = `var regexp = getRegExp(123);`
    expect(() => transform({...baseOptions, code: wxsCode})).toThrow() 
    expect(logFileMap).toMatchSnapshot()
  })

  test('getRegExp 有两个参数，其中某个参数为非字符串', () => { 
    const wxsCode = `var regexp = getRegExp(123, "img");`
    expect(() => transform({...baseOptions, code: wxsCode})).toThrow() 
    expect(logFileMap).toMatchSnapshot()
  })

  test('wxs标签中的getDate()转换为new Date()', () => {
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
    expect(logFileMap).toMatchSnapshot()
  })

  test('wxs中使用wx原生方法的转换', () => {
    const wxsCode = `
      function getSystemInfo() {
        return wx.getSystemInfoSync();
      }
      module.exports = {
        getSystemInfo : getSystemInfo
      };
    `
    const { code } = transform({
      ...baseOptions,
      code: wxsCode,
    })
    expect(code).toMatchSnapshot()
    expect(logFileMap).toMatchSnapshot()
  })
})