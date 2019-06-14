// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

/* global describe, it, expect */

'use strict'
var postcss = require('postcss')
var pxtorem = require('./index')
var basicCSS = '.rule { font-size: 15px }'
var filterPropList = require('./lib/filter-prop-list')

describe('pxtorem', function () {
  it('1 should work on the readme example', function () {
    var input = 'h1 { margin: 0 0 20px; font-size: 32px; line-height: 1.2; letter-spacing: 1px; }'
    var output = 'h1 { margin: 0 0 0.5rem; font-size: 0.8rem; line-height: 1.2; letter-spacing: 0.025rem; }'
    var processed = postcss(pxtorem({platform: 'h5', designWidth: 640}))
      .process(input).css

    expect(processed).toBe(output)
  })

  it('2 should replace the px unit with rem', function () {
    var processed = postcss(pxtorem({platform: 'h5', designWidth: 640}))
      .process(basicCSS).css
    var expected = '.rule { font-size: 0.375rem }'

    expect(processed).toBe(expected)
  })

  it('3 should ignore non px properties', function () {
    var expected = '.rule { font-size: 2em }'
    var processed = postcss(pxtorem({platform: 'h5', designWidth: 640}))
      .process(expected).css

    expect(processed).toBe(expected)
  })

  it('4 should handle < 1 values and values without a leading 0 - legacy',
    function () {
      var rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }'
      var expected = '.rule { margin: 0.5rem 0.0125rem -0.005rem -.2em }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['margin']
      }
      var processed = postcss(pxtorem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('5 should handle < 1 values and values without a leading 0', function () {
    var rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }'
    var expected = '.rule { margin: 0.5rem 0.0125rem -0.005rem -.2em }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['margin']
    }
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('6 should not add properties that already exist', function () {
    var expected = '.rule { font-size: 40px; font-size: 1rem; }'
    var processed = postcss(pxtorem({platform: 'h5', designWidth: 640}))
      .process(expected).css

    expect(processed).toBe(expected)
  })

  it('7 should remain unitless if 0', function () {
    var expected = '.rule { font-size: 0px; font-size: 0; }'
    var processed = postcss(pxtorem()).process(expected).css

    expect(processed).toBe(expected)
  })
})

describe('value parsing', function () {
  it('1 should not replace values in double quotes or single quotes - legacy',
    function () {
      var options = {
        platform: 'h5',
        designWidth: 640
        // propWhiteList: []
      }
      var rules = '.rule { content: \'16px\'; font-family: "16px"; font-size: 16px; }'
      var expected = '.rule { content: \'16px\'; font-family: "16px"; font-size: 0.4rem; }'
      var processed = postcss(pxtorem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('2 should not replace values in double quotes or single quotes',
    function () {
      var options = {
        platform: 'h5',
        designWidth: 640,
        propList: ['*']
      }
      var rules = '.rule { content: \'16px\'; font-family: "16px"; font-size: 16px; }'
      var expected = '.rule { content: \'16px\'; font-family: "16px"; font-size: 0.4rem; }'
      var processed = postcss(pxtorem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('3 should not replace values in `url()` - legacy', function () {
    var options = {
      platform: 'h5',
      designWidth: 640
      // propWhiteList: []
    }
    var rules = '.rule { background: url(16px.jpg); font-size: 16px; }'
    var expected = '.rule { background: url(16px.jpg); font-size: 0.4rem; }'
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('4 should not replace values in `url()`', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['*']
    }
    var rules = '.rule { background: url(16px.jpg); font-size: 16px; }'
    var expected = '.rule { background: url(16px.jpg); font-size: 0.4rem; }'
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('5 should not replace values with an uppercase P or X', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      propList: ['*']
    }
    var rules = '.rule { margin: 12px calc(100% - 14PX); height: calc(100% - 20px); font-size: 12Px; line-height: 16px; }'
    var expected = '.rule { margin: 0.3rem calc(100% - 14PX); height: calc(100% - 0.5rem); font-size: 12Px; line-height: 0.4rem; }'
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('unitPrecision', function () {
  // Deprecate
  it('1 should replace using a decimal of 2 places - legacy', function () {
    var expected = '.rule { font-size: 0.38rem }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      unit_precision: 2
    }
    var processed = postcss(pxtorem(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })

  it('2 should replace using a decimal of 2 places', function () {
    var expected = '.rule { font-size: 0.38rem }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      unitPrecision: 2
    }
    var processed = postcss(pxtorem(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })
})

describe('propWhiteList', function () {
  // Deprecate
  it('3 should only replace properties in the white list - legacy',
    function () {
      var expected = '.rule { font-size: 15px }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        prop_white_list: ['font']
      }
      var processed = postcss(pxtorem(options)).process(basicCSS).css

      expect(processed).toBe(expected)
    })

  it('4 should only replace properties in the white list - legacy',
    function () {
      var expected = '.rule { font-size: 15px }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['font']
      }
      var processed = postcss(pxtorem(options)).process(basicCSS).css

      expect(processed).toBe(expected)
    })

  it('5 should only replace properties in the white list - legacy',
    function () {
      var css = '.rule { margin: 16px; margin-left: 10px }'
      var expected = '.rule { margin: 0.4rem; margin-left: 10px }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['margin']
      }
      var processed = postcss(pxtorem(options)).process(css).css

      expect(processed).toBe(expected)
    })

  it('6 should only replace properties in the prop list', function () {
    var css = '.rule { font-size: 16px; margin: 16px; margin-left: 5px; padding: 5px; padding-right: 16px }'
    var expected = '.rule { font-size: 0.4rem; margin: 0.4rem; margin-left: 5px; padding: 5px; padding-right: 0.4rem }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      propWhiteList: ['*font*', 'margin*', '!margin-left', '*-right', 'pad']
    }
    var processed = postcss(pxtorem(options)).process(css).css

    expect(processed).toBe(expected)
  })

  it('7 should only replace properties in the prop list with wildcard',
    function () {
      var css = '.rule { font-size: 16px; margin: 16px; margin-left: 5px; padding: 5px; padding-right: 16px }'
      var expected = '.rule { font-size: 16px; margin: 0.4rem; margin-left: 5px; padding: 5px; padding-right: 16px }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        propWhiteList: ['*', '!margin-left', '!*padding*', '!font*']
      }
      var processed = postcss(pxtorem(options)).process(css).css

      expect(processed).toBe(expected)
    })

  it('8 should replace all properties when white list is empty', function () {
    var rules = '.rule { margin: 16px; font-size: 15px }'
    var expected = '.rule { margin: 0.4rem; font-size: 0.375rem }'
    var options = {
      platform: 'h5',
      designWidth: 640
      // propWhiteList: []
    }
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('selectorBlackList', function () {
  // Deprecate
  it('1 should ignore selectors in the selector black list - legacy',
    function () {
      var rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }'
      var expected = '.rule { font-size: 0.375rem } .rule2 { font-size: 15px }'
      var options = {
        platform: 'h5',
        designWidth: 640,
        selector_black_list: ['.rule2']
      }
      var processed = postcss(pxtorem(options)).process(rules).css

      expect(processed).toBe(expected)
    })

  it('2 should ignore selectors in the selector black list', function () {
    var rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }'
    var expected = '.rule { font-size: 0.375rem } .rule2 { font-size: 15px }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: ['.rule2']
    }
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('3 should ignore every selector with `body$`', function () {
    var rules = 'body { font-size: 16px; } .class-body$ { font-size: 16px; } .simple-class { font-size: 16px; }'
    var expected = 'body { font-size: 0.4rem; } .class-body$ { font-size: 16px; } .simple-class { font-size: 0.4rem; }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: ['body$']
    }
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('4 should only ignore exactly `body`', function () {
    var rules = 'body { font-size: 16px; } .class-body { font-size: 16px; } .simple-class { font-size: 16px; }'
    var expected = 'body { font-size: 16px; } .class-body { font-size: 0.4rem; } .simple-class { font-size: 0.4rem; }'
    var options = {
      platform: 'h5',
      designWidth: 640,
      selectorBlackList: [/^body$/]
    }
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('replace', function () {
  it('1 should leave fallback pixel unit with root em value', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      replace: false
    }
    var processed = postcss(pxtorem(options)).process(basicCSS).css
    var expected = '.rule { font-size: 15px; font-size: 0.375rem }'

    expect(processed).toBe(expected)
  })
})

describe('mediaQuery', function () {
  // Deprecate
  it('1 should replace px in media queries', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      media_query: true
    }
    var processed = postcss(pxtorem(options))
      .process('@media (min-width: 500px) { .rule { font-size: 16px } }').css
    var expected = '@media (min-width: 12.5rem) { .rule { font-size: 0.4rem } }'

    expect(processed).toBe(expected)
  })

  it('2 should replace px in media queries', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      mediaQuery: true
    }
    var processed = postcss(pxtorem(options))
      .process('@media (min-width: 500px) { .rule { font-size: 16px } }').css
    var expected = '@media (min-width: 12.5rem) { .rule { font-size: 0.4rem } }'

    expect(processed).toBe(expected)
  })
})

describe('minPixelValue', function () {
  it('1 should not replace values below minPixelValue', function () {
    var options = {
      platform: 'h5',
      designWidth: 640,
      // propWhiteList: [],
      minPixelValue: 2
    }
    var rules = '.rule { border: 1px solid #000; font-size: 16px; margin: 1px 10px; }'
    var expected = '.rule { border: 1px solid #000; font-size: 0.4rem; margin: 1px 0.25rem; }'
    var processed = postcss(pxtorem(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('filter-prop-list', function () {
  it('1 should find "exact" matches from propList', function () {
    var propList = [
      'font-size',
      'margin',
      '!padding',
      '*border*',
      '*',
      '*y',
      '!*font*']
    var expected = 'font-size,margin'
    expect(filterPropList.exact(propList).join()).toBe(expected)
  })

  it('2 should find "contain" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        '*border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'margin,border'
      expect(filterPropList.contain(propList).join()).toBe(expected)
    })

  it('3 should find "start" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'border'
      expect(filterPropList.startWith(propList).join()).toBe(expected)
    })

  it('4 should find "end" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'y'
      expect(filterPropList.endWith(propList).join()).toBe(expected)
    })

  it('5 should find "not" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        'border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'padding'
      expect(filterPropList.notExact(propList).join()).toBe(expected)
    })

  it('6 should find "not contain" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'font'
      expect(filterPropList.notContain(propList).join()).toBe(expected)
    })

  it('7 should find "not start" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '*y',
        '!*font*']
      var expected = 'border'
      expect(filterPropList.notStartWith(propList).join()).toBe(expected)
    })

  it('8 should find "not end" matches from propList and reduce to string',
    function () {
      var propList = [
        'font-size',
        '*margin*',
        '!padding',
        '!border*',
        '*',
        '!*y',
        '!*font*']
      var expected = 'y'
      expect(filterPropList.notEndWith(propList).join()).toBe(expected)
    })
})

// 补充的测试用例

describe('不传任何配置', () => {
  it('不传任何配置', function () {
    var rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    var expected = 'h1 {margin: 0 0 20rpx;font-size: 40rpx;line-height: 1.2;}'
    var processed = postcss(pxtorem()).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('platform 为 weapp', () => {
  it('{platform: \'weapp\', designWidth: 750} ', () => {
    var rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    var expected = 'h1 {margin: 0 0 20rpx;font-size: 40Px;line-height: 1.2;}'
    var options = {
      platform: 'weapp',
      designWidth: 750
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'weapp\', designWidth: 640} ', () => {
    var rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    var expected = 'h1 {margin: 0 0 17.09402rpx;font-size: 34.18803rpx;line-height: 1.2;}'
    var options = {
      platform: 'weapp',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 h5', () => {
  it('{platform: \'h5\', designWidth: 750} ', () => {
    var rules = 'h1 {margin: 0 0 20px;font-size: 40px;line-height: 1.2;}'
    var expected = 'h1 {margin: 0 0 0.42667rem;font-size: 0.85333rem;line-height: 1.2;}'
    var options = {
      platform: 'h5',
      designWidth: 750
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(expected)
  })

  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = 'h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    var expected = 'h1 {margin: 0 0 0.5rem;font-size: 40Px;line-height: 1.2;}'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(expected)
  })
})

describe('platform 为 h5，文件头部带注释的不转换', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = '/*postcss-pxtransform disable*/ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定 h5 平台保留', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = '/*  #ifdef  h5  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 rn 平台保留', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = '/*  #ifdef  rn  */ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe('/*  #ifdef  rn  *//*  #endif  */ .test{}')
  })
})

describe('platform 为 rn，指定平台 h5 rn 平台保留', () => {
  it('{platform: \'rn\', designWidth: 640} ', () => {
    var rules = '/*  #ifdef  h5 rn  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    var options = {
      platform: 'rn',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 rn 平台剔除', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = '/*  #ifndef  rn  */ h1 {margin: 0 0 20Px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe(rules)
  })
})

describe('platform 为 h5，指定平台 h5 平台剔除', () => {
  it('{platform: \'h5\', designWidth: 640} ', () => {
    var rules = '/*  #ifndef  h5  */ h1 {margin: 0 0 20px;font-size: 40Px;line-height: 1.2;}/*  #endif  */ .test{}'
    var options = {
      platform: 'h5',
      designWidth: 640
    }
    var processed = postcss(pxtorem(options)).process(rules).css
    expect(processed).toBe('/*  #ifndef  h5  *//*  #endif  */ .test{}')
  })
})
