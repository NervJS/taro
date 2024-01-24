const Processors = require('postcss')
const unitTransform = require('../index')

describe('wxss解析', () => {
  test('wxss文件样式解析', () => {
    const input = `
        .box{
            width: 100px;
            height: 200rpx;
            border: 0.5px solid red;
            margin: 0.5px 100px;
            transform: translate(0px, 0rpx);
            font-size: 0rpx;
          }`
    const result = Processors([unitTransform]).process(input)
    expect(result.css).toBe(`
        .box{
            width: 200px;
            height: 200px;
            border: 1px solid red;
            margin: 1px 200px;
            transform: translate(0px, 0px);
            font-size: 0px;
          }`)
  })
})