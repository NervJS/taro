import { getMergeLoaderTemplateReg } from '../utils'

describe('getMergeLoaderTemplateReg', () => {
  it('should return match current template RegExp', () => {
    const input1 = '.xhsml' // 小红书小程序模版后缀
    const input2 = '.ksml' // 快手小程序模版后缀
    expect(getMergeLoaderTemplateReg(input1)).toEqual(/\.(wxml|axml|ttml|qml|swan|jxml|xhsml)(\?.*)?$/)
    expect(getMergeLoaderTemplateReg(input2)).toEqual(/\.(wxml|axml|ttml|qml|swan|jxml|ksml)(\?.*)?$/)
  })
})