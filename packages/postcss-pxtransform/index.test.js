var postcss = require('postcss')

var plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)])
    .process(input, {from: undefined})
    .then(result => {
      expect(result.css).toEqual(output)
      expect(result.warnings().length).toBe(0)
    })
}

describe('不传任何配置', () => {
  it('不传任何配置', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 20rpx;font-size: 40rpx;line-height: 1.2;}`)
  })
})

describe('platform 为 weapp', () => {
  it('{platform: \'weapp\', designWidth: 750} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 20rpx;font-size: 40rpx;line-height: 1.2;}`,
      {platform: 'weapp', designWidth: 750})
  })

  it('{platform: \'weapp\', designWidth: 750} ', () => {
    return run(`h1 {margin: 0 0 20Px;font-size: 40PX;line-height: 1.2;}`,
      `h1 {margin: 0 0 20Px;font-size: 40PX;line-height: 1.2;}`,
      {platform: 'weapp', designWidth: 750})
  })

  it(' {designWidth: 640} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 17.0941rpx;font-size: 34.1881rpx;line-height: 1.2;}`,
      {platform: 'weapp', designWidth: 640})
  })
})

describe('platform 为 h5', () => {
  it('{designWidth: 750}', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 0.42667rem;font-size: 0.85333rem;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 750})
  })

  it('{designWidth: 750}', () => {
    return run(`h1 {margin: 0 0 20Px;font-size: 40PX;line-height: 1.2;}`,
      `h1 {margin: 0 0 20Px;font-size: 40PX;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 750})
  })

  it(' {designWidth: 640} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 0.5rem;font-size: 1rem;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 640})
  })
})
