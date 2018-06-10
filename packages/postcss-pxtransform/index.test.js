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

  it(' {designWidth: 750, rootValue: 10} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 2rpx;font-size: 4rpx;line-height: 1.2;}`,
      {platform: 'weapp', designWidth: 750, rootValue: '10'})
  })

  it(' {designWidth: 640, rootValue: 40} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 1.7095rpx;font-size: 3.4189rpx;line-height: 1.2;}`,
      {platform: 'weapp', designWidth: 640, rootValue: '10'})
  })
})

describe('platform 为 h5', () => {
  it('{designWidth: 750}', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 0.5rem;font-size: 1rem;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 750})
  })

  it(' {designWidth: 750, rootValue: 10} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 2rem;font-size: 4rem;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 750, rootValue: 10})
  })

  it(' {designWidth: 640, rootValue: 40} ', () => {
    return run(`h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}`,
      `h1 {margin: 0 0 0.5rem;font-size: 1rem;line-height: 1.2;}`,
      {platform: 'h5', designWidth: 640, rootValue: 40})
  })
})
