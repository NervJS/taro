'use strict'
const postcss = require('postcss')
const px2rem = require('../index')

const basicCSS = '.rule { font-size: 15px }'
const filterPropList = require('../lib/filter-prop-list')

describe('px2rem', function () {
  it('1 should work on the readme example', function () {
    const input = 'h1 { margin: 0 0 20px; font-size: 32px; line-height: 1.2; letter-spacing: 1px; }'
    const output = 'h1 { margin: 0 0 0.585rem; font-size: 0.936rem; line-height: 1.2; letter-spacing: 0.02925rem; }'
    const processed = postcss(px2rem({ platform: 'h5', designWidth: 640 }))
      .process(input).css

    expect(processed).toBe(output)
  })

  it('2 should replace the px unit with rem', function () {
    const processed = postcss(px2rem({ platform: 'h5', designWidth: 640 }))
      .process(basicCSS).css
    const expected = '.rule { font-size: 0.43875rem }'

    expect(processed).toBe(expected)
  })

  it('3 should ignore non px properties', function () {
    const expected = '.rule { font-size: 2em }'
    const processed = postcss(px2rem({ platform: 'h5', designWidth: 640 }))
      .process(expected).css

    expect(processed).toBe(expected)
  })

  it('4 should handle < 1 values and values without a leading 0 - legacy',
    function () {
      const rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }'
      const expected = '.rule { margin: 0.5rem 0.01463rem -0.00585rem -.2em }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['margin']
      }
      const processed = postcss(px2rem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('5 should handle < 1 values and values without a leading 0', function () {
    const rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }'
    const expected = '.rule { margin: 0.5rem 0.01463rem -0.00585rem -.2em }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['margin']
    }
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('6 should not add properties that already exist', function () {
    const expected = '.rule { font-size: 40px; font-size: 1rem; }'
    const processed = postcss(px2rem({ platform: 'h5', designWidth: 750 }))
      .process(expected).css

    expect(processed).toBe(expected)
  })

  it('7 属性值为"0"时不处理，为"0px"时仍然单位转换', function () {
    const rule = '.rule { font-size: 0px; font-size: 0; }'
    const expected = '.rule { font-size: 0rpx; font-size: 0; }'
    const processed = postcss(px2rem()).process(rule).css

    expect(processed).toBe(expected)
  })

  it('8 should work on custom baseFontSize', function () {
    const processed = postcss(px2rem({ platform: 'h5', baseFontSize: 15 })).process(basicCSS).css
    const expected = '.rule { font-size: 0.5rem }'

    expect(processed).toBe(expected)
  })
})

describe('value parsing', function () {
  it('1 should not replace values in double quotes or single quotes - legacy',
    function () {
      const options = {
        platform: 'h5',
        designWidth: 640
        // propWhiteList: []
      }
      const rules = '.rule { content: \'16px\'; font-family: "16px"; font-size: 16px; }'
      const expected = '.rule { content: \'16px\'; font-family: "16px"; font-size: 0.468rem; }'
      const processed = postcss(px2rem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('2 should not replace values in double quotes or single quotes',
    function () {
      const options = {
        platform: 'h5',
        designWidth: 640,
        propList: ['*']
      }
      const rules = '.rule { content: \'16px\'; font-family: "16px"; font-size: 16px; }'
      const expected = '.rule { content: \'16px\'; font-family: "16px"; font-size: 0.468rem; }'
      const processed = postcss(px2rem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('3 should not replace values in `url()` - legacy', function () {
    const options = {
      platform: 'h5',
      designWidth: 640
      // propWhiteList: []
    }
    const rules = '.rule { background: url(16px.jpg); font-size: 16px; }'
    const expected = '.rule { background: url(16px.jpg); font-size: 0.468rem; }'
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('4 should not replace values in `url()`', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['*']
    }
    const rules = '.rule { background: url(16px.jpg); font-size: 16px; }'
    const expected = '.rule { background: url(16px.jpg); font-size: 0.468rem; }'
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('5 should not replace values with an uppercase P or X', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['*']
    }
    const rules = '.rule { margin: 12px calc(100% - 14PX); height: calc(100% - 20px); font-size: 12Px; line-height: 16px; }'
    const expected = '.rule { margin: 0.351rem calc(100% - 14PX); height: calc(100% - 0.585rem); font-size: 12Px; line-height: 0.468rem; }'
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('unitPrecision', function () {
  // Deprecate
  it('1 should replace using a decimal of 2 places - legacy', function () {
    const expected = '.rule { font-size: 0.44rem }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      unit_precision: 2
    }
    const processed = postcss(px2rem(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })

  it('2 should replace using a decimal of 2 places', function () {
    const expected = '.rule { font-size: 0.44rem }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      unitPrecision: 2
    }
    const processed = postcss(px2rem(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })
})

describe('propWhiteList', function () {
  // Deprecate
  it('3 should only replace properties in the white list - legacy',
    function () {
      const expected = '.rule { font-size: 15px }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        prop_white_list: ['font']
      }
      const processed = postcss(px2rem(options)).process(basicCSS).css

      expect(processed).toBe(expected)
    })

  it('4 should only replace properties in the white list - legacy',
    function () {
      const expected = '.rule { font-size: 15px }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['font']
      }
      const processed = postcss(px2rem(options)).process(basicCSS).css

      expect(processed).toBe(expected)
    })

  it('5 should only replace properties in the white list - legacy',
    function () {
      const css = '.rule { margin: 16px; margin-left: 10px }'
      const expected = '.rule { margin: 0.468rem; margin-left: 10px }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['margin']
      }
      const processed = postcss(px2rem(options)).process(css).css

      expect(processed).toBe(expected)
    })

  it('6 should only replace properties in the prop list', function () {
    const css = '.rule { font-size: 16px; margin: 16px; margin-left: 5px; padding: 5px; padding-right: 16px }'
    const expected = '.rule { font-size: 0.468rem; margin: 0.468rem; margin-left: 5px; padding: 5px; padding-right: 0.468rem }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      propWhiteList: ['*font*', 'margin*', '!margin-left', '*-right', 'pad']
    }
    const processed = postcss(px2rem(options)).process(css).css

    expect(processed).toBe(expected)
  })

  it('7 should only replace properties in the prop list with wildcard',
    function () {
      const css = '.rule { font-size: 16px; margin: 16px; margin-left: 5px; padding: 5px; padding-right: 16px }'
      const expected = '.rule { font-size: 16px; margin: 0.468rem; margin-left: 5px; padding: 5px; padding-right: 16px }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['*', '!margin-left', '!*padding*', '!font*']
      }
      const processed = postcss(px2rem(options)).process(css).css

      expect(processed).toBe(expected)
    })

  it('8 should replace all properties when white list is empty', function () {
    const rules = '.rule { margin: 16px; font-size: 15px }'
    const expected = '.rule { margin: 0.468rem; font-size: 0.43875rem }'
    const options = {
      platform: 'h5',
      designWidth: 640
      // propWhiteList: []
    }
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('selectorBlackList', function () {
  // Deprecate
  it('1 should ignore selectors in the selector black list - legacy',
    function () {
      const rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }'
      const expected = '.rule { font-size: 0.43875rem } .rule2 { font-size: 15px }'
      const options = {
        platform: 'h5',
        designWidth: 640,
        selector_black_list: ['.rule2']
      }
      const processed = postcss(px2rem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('2 should ignore selectors in the selector black list', function () {
    const rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }'
    const expected = '.rule { font-size: 0.43875rem } .rule2 { font-size: 15px }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: ['.rule2']
    }
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('3 should ignore every selector with `body$`', function () {
    const rules = 'body { font-size: 16px; } .class-body$ { font-size: 16px; } .simple-class { font-size: 16px; }'
    const expected = 'body { font-size: 0.468rem; } .class-body$ { font-size: 16px; } .simple-class { font-size: 0.468rem; }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: ['body$']
    }
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('4 should only ignore exactly `body`', function () {
    const rules = 'body { font-size: 16px; } .class-body { font-size: 16px; } .simple-class { font-size: 16px; }'
    const expected = 'body { font-size: 16px; } .class-body { font-size: 0.468rem; } .simple-class { font-size: 0.468rem; }'
    const options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: [/^body$/]
    }
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('replace', function () {
  it('1 should leave fallback pixel unit with root em value', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      replace: false
    }
    const processed = postcss(px2rem(options)).process(basicCSS).css
    const expected = '.rule { font-size: 15px; font-size: 0.43875rem }'

    expect(processed).toBe(expected)
  })
})

describe('mediaQuery', function () {
  // Deprecate
  it('1 should replace px in media queries', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      media_query: true
    }
    const processed = postcss(px2rem(options))
      .process('@media (min-width: 500px) { .rule { font-size: 16px } }').css
    const expected = '@media (min-width: 14.625rem) { .rule { font-size: 0.468rem } }'

    expect(processed).toBe(expected)
  })

  it('2 should replace px in media queries', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      mediaQuery: true
    }
    const processed = postcss(px2rem(options))
      .process('@media (min-width: 500px) { .rule { font-size: 16px } }').css
    const expected = '@media (min-width: 14.625rem) { .rule { font-size: 0.468rem } }'

    expect(processed).toBe(expected)
  })
})

describe('minPixelValue', function () {
  it('1 should not replace values below minPixelValue', function () {
    const options = {
      platform: 'h5',
      designWidth: 640,
      // propWhiteList: [],
      minPixelValue: 2
    }
    const rules = '.rule { border: 1px solid #000; font-size: 16px; margin: 1px 10px; }'
    const expected = '.rule { border: 1px solid #000; font-size: 0.468rem; margin: 1px 0.2925rem; }'
    const processed = postcss(px2rem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('filter-prop-list', function () {
  it('1 should find "exact" matches from propList', function () {
    const propList = [
      'font-size',
      'margin',
      '!padding',
      '*border*',
      '*',
      '*y',
      '!*font*']
    const expected = 'font-size,margin'
    expect(filterPropList.exact(propList).join()).toBe(expected)
  })

  it('2 should find "contain" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        '*border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'margin,border'
      expect(filterPropList.contain(propList).join()).toBe(expected)
    })

  it('3 should find "start" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'border'
      expect(filterPropList.startWith(propList).join()).toBe(expected)
    })

  it('4 should find "end" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'y'
      expect(filterPropList.endWith(propList).join()).toBe(expected)
    })

  it('5 should find "not" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'padding'
      expect(filterPropList.notExact(propList).join()).toBe(expected)
    })

  it('6 should find "not contain" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'font'
      expect(filterPropList.notContain(propList).join()).toBe(expected)
    })

  it('7 should find "not start" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '*y',
        '!*font*']
      const expected = 'border'
      expect(filterPropList.notStartWith(propList).join()).toBe(expected)
    })

  it('8 should find "not end" matches from propList and reduce to string',
    function () {
      const propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '!*y',
        '!*font*']
      const expected = 'y'
      expect(filterPropList.notEndWith(propList).join()).toBe(expected)
    })
})

// 补充的测试用例

describe('不传任何配置', () => {
  it('不传任何配置', function () {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 20rpx;font-size: 40rpx;line-height: 1.2;}'
    const processed = postcss(px2rem()).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('platform 为 weapp', () => {
  it('{platform: \'weapp\', designWidth: 750} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 750
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 23.4rpx;font-size: 46.8rpx;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 375} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 40rpx;font-size: 80rpx;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 375
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 weapp, targetUnit 为 rem', () => {
  it('{platform: \'weapp\', designWidth: 750, targetUnit: \'rem\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 0.5rem;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 750,
      targetUnit: 'rem'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 640, targetUnit: \'rem\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 0.585rem;font-size: 1.17rem;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 640,
      targetUnit: 'rem'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 375, targetUnit: \'rem\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 1rem;font-size: 2rem;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 375,
      targetUnit: 'rem'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 weapp, targetUnit 为 px', () => {
  it('{platform: \'weapp\', designWidth: 750, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 10px;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 750,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 640, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 11.7px;font-size: 23.4px;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 640,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 375, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const options = {
      platform: 'weapp',
      designWidth: 375,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 h5', () => {
  it('{platform: \'h5\', designWidth: 750} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 0.5rem;font-size: 1rem;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 750
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 0.585rem;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'h5\', designWidth: 375} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 1rem;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 375
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 h5, targetUnit 为 px', () => {
  it('{platform: \'h5\', designWidth: 750, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 10px;font-size: 20px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 750,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'h5\', designWidth: 640, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 11.7px;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 640,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'h5\', designWidth: 375, targetUnit: \'px\'} ', () => {
    const rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const expected = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 375,
      targetUnit: 'px'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 h5，文件头部带注释的不转换', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = '/*postcss-pxtransform disable*/ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定 h5 平台保留', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = '/*  #ifdef  h5  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 rn 平台保留', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = '/*  #ifdef  rn  */ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('/*  #ifdef  rn  *//*  #endif  */ .test{}')
  })
})

describe('platform 为 rn，指定平台 h5 rn 平台保留', () => {
  it('{platform: \'rn\', designWidth: 640} ', () => {
    const rules = '/*  #ifdef  h5 rn  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    const options = {
      platform: 'rn',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 rn 平台剔除', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = '/*  #ifndef  rn  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 h5 平台剔除', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = '/*  #ifndef  h5  */ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('/*  #ifndef  h5  *//*  #endif  */ .test{}')
  })
})

describe('rpx 单位转换', () => {
  it('{platform: \'weapp\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'weapp',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;} .test{}')
  })

  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'h5',
      designWidth: 640
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 0.585rem;font-size: 40Px;line-height: 1.2;} .test{}')
  })

  it('{platform: \'weapp\', designWidth: 375} ', () => {
    const rules = 'h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'weapp',
      designWidth: 375
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;} .test{}')
  })
})

describe('vw 单位转换', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 640px;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'h5',
      designWidth: 750,
      targetUnit: 'vw'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 85.33333vw;font-size: 40Px;line-height: 1.2;} .test{}')
  })

  it('{platform: \'h5\', designWidth: 750} ', () => {
    const rules = 'h1 {margin: 0 0 375px;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'h5',
      designWidth: 750,
      targetUnit: 'vw'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 50vw;font-size: 40Px;line-height: 1.2;} .test{}')
  })

  it('{platform: \'h5\', designWidth: 640} ', () => {
    const rules = 'h1 {margin: 0 0 320px;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'h5',
      designWidth: 640,
      targetUnit: 'vw'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 50vw;font-size: 40Px;line-height: 1.2;} .test{}')
  })

  it('{platform: \'h5\', designWidth: 375} ', () => {
    const rules = 'h1 {margin: 0 0 320px;font-size: 40Px;line-height: 1.2;} .test{}'
    const options = {
      platform: 'h5',
      designWidth: 375,
      targetUnit: 'vw'
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('h1 {margin: 0 0 85.33333vw;font-size: 40Px;line-height: 1.2;} .test{}')
  })
})

describe('platform 为 rn，适配', () => {
  it('{platform: \'rn\', designWidth: 750} ', () => {
    const rules = 'view { width: 100px; }'
    const options = {
      platform: 'rn',
      designWidth: 750,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('view { width: 50px; }')
  })
})

describe('platform 为 harmony，适配', () => {
  it('{platform: \'harmony\', designWidth: 640} ', () => {
    const rules = 'view { width: 100PX; }'
    const options = {
      platform: 'harmony',
      designWidth: 640,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    }
    const processed = postcss(px2rem(options)).process(rules).css
    expect(processed).toBe('view { width: 100vp; }')
  })
})
