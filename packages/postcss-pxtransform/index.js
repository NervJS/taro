const pxRegex = require('./lib/pixel-unit-regex')
const PXRegex = require('./lib/pixel-upper-unit-regex')
const filterPropList = require('./lib/filter-prop-list')

const defaults = {
  rootValue: 16,
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['*'],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
}

const legacyOptions = {
  root_value: 'rootValue',
  unit_precision: 'unitPrecision',
  selector_black_list: 'selectorBlackList',
  prop_white_list: 'propList',
  media_query: 'mediaQuery',
  propWhiteList: 'propList'
}

const deviceRatio = {
  375: 2,
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}

const DEFAULT_WEAPP_OPTIONS = {
  platform: 'weapp',
  designWidth: 750,
  deviceRatio
}

const processed = Symbol('processed')


let targetUnit

module.exports = (options = {}) => {
  options = Object.assign({}, DEFAULT_WEAPP_OPTIONS, options)

  const transUnits = ['px']
  const baseFontSize = options.baseFontSize || (options.minRootSize >= 1 ? options.minRootSize : 20)
  const designWidth = (input) =>
    typeof options.designWidth === 'function' ? options.designWidth(input) : options.designWidth

  switch (options.platform) {
    case 'h5': {
      targetUnit = options.targetUnit ?? 'rem'

      if (targetUnit === 'vw') {
        options.rootValue = (input) => {
          return designWidth(input) / 100
        }
      } else if (targetUnit === 'px') {
        options.rootValue = (input) => (1 / options.deviceRatio[designWidth(input)]) * 2
      } else {
        // rem
        options.rootValue = (input) => {
          return (baseFontSize / options.deviceRatio[designWidth(input)]) * 2
        }
      }

      transUnits.push('rpx')
      break
    }
    case 'rn': {
      options.rootValue = (input) => (1 / options.deviceRatio[designWidth(input)]) * 2
      targetUnit = 'px'
      break
    }
    case 'quickapp': {
      options.rootValue = () => 1
      targetUnit = 'px'
      break
    }
    case 'harmony': {
      options.rootValue = (input) => 1 / options.deviceRatio[designWidth(input)]
      targetUnit = 'px'
      break
    }
    default: {
      // mini-program
      targetUnit = options.targetUnit ?? 'rpx'

      if (targetUnit === 'rem') {
        options.rootValue = (input) => (baseFontSize / options.deviceRatio[designWidth(input)]) * 2
      } else if (targetUnit === 'px') {
        options.rootValue = (input) => (1 / options.deviceRatio[designWidth(input)]) * 2
      } else {
        // rpx
        options.rootValue = (input) => 1 / options.deviceRatio[designWidth(input)]
      }
    }
  }

  convertLegacyOptions(options)

  const opts = Object.assign({}, defaults, options)
  const onePxTransform = typeof options.onePxTransform === 'undefined' ? true : options.onePxTransform
  const pxRgx = pxRegex(transUnits)

  const satisfyPropList = createPropListMatcher(opts.propList)

  return {
    postcssPlugin: 'postcss-pxtransform',
    prepare (result) {
      const pxReplace = createPxReplace(
        opts.rootValue,
        opts.unitPrecision,
        opts.minPixelValue,
        onePxTransform
      )(result.root.source.input)

      /** 是否跳过当前文件不处理 */
      let skip = false

      return {
        // 注意：钩子在节点变动时会重新执行，Once，OnceExit只执行一次，https://github.com/NervJS/taro/issues/13238
        Comment (comment) {
          if (comment.text === 'postcss-pxtransform disable') {
            skip = true
            return
          }

          // delete code between comment in RN
          // 有死循环的问题
          if (options.platform === 'rn') {
            if (comment.text === 'postcss-pxtransform rn eject enable') {
              let next = comment.next()
              while (next) {
                if (next.text === 'postcss-pxtransform rn eject disable') {
                  break
                }
                const temp = next.next()
                next.remove()
                next = temp
              }
            }
          }

          /*  #ifdef  %PLATFORM%
           *  平台特有样式
           *  #endif  */
          const wordList = comment.text.split(' ')
          // 指定平台保留
          if (wordList.indexOf('#ifdef') > -1) {
            // 非指定平台
            if (wordList.indexOf(options.platform) === -1) {
              let next = comment.next()
              while (next) {
                if (next.type === 'comment' && next.text.trim() === '#endif') {
                  break
                }
                const temp = next.next()
                next.remove()
                next = temp
              }
            }
          }

          /*  #ifdef  %PLATFORM%
           *  平台特有样式
           *  #endif  */
          // 指定平台剔除
          if (wordList.indexOf('#ifndef') > -1) {
            // 指定平台
            if (wordList.indexOf(options.platform) > -1) {
              let next = comment.next()
              while (next) {
                if (next.type === 'comment' && next.text.trim() === '#endif') {
                  break
                }
                const temp = next.next()
                next.remove()
                next = temp
              }
            }
          }
        },
        Declaration (decl) {
          if (skip) return

          if (decl[processed]) return

          // 标记当前 node 已处理
          decl[processed] = true

          if (options.platform === 'harmony') {
            if (decl.value.indexOf('PX') === -1) return
            const value = decl.value.replace(PXRegex, function (m, _$1, $2) {
              return m.replace($2, 'vp')
            })
            decl.value = value
          } else {
            if (decl.value.indexOf('px') === -1) return

            if (!satisfyPropList(decl.prop)) return

            if (blacklistedSelector(opts.selectorBlackList, decl.parent.selector)) return
            const value = decl.value.replace(pxRgx, pxReplace)
            // if rem unit already exists, do not add or replace
            if (declarationExists(decl.parent, decl.prop, value)) return
            if (opts.replace) {
              decl.value = value
            } else {
              decl.cloneAfter({ value: value })
            }
          }
        },
        AtRule: {
          media: (rule) => {
            if (skip) return
            if (options.platform === 'harmony') {
              if (rule.params.indexOf('PX') === -1) return
              const value = rule.params.replace(PXRegex, function (m, _$1, $2) {
                return m.replace($2, 'vp')
              })
              rule.params = value
            } else {
              if (rule.params.indexOf('px') === -1) return
              rule.params = rule.params.replace(pxRgx, pxReplace)
            }
          },
        },
      }
    },
  }
}

function convertLegacyOptions (options) {
  if (typeof options !== 'object') return
  if (
    (
      (typeof options.prop_white_list !== 'undefined' &&
        options.prop_white_list.length === 0) ||
      (typeof options.propWhiteList !== 'undefined' &&
        options.propWhiteList.length === 0)
    ) &&
    typeof options.propList === 'undefined'
  ) {
    options.propList = ['*']
    delete options.prop_white_list
    delete options.propWhiteList
  }
  Object.keys(legacyOptions).forEach(function (key) {
    if (options.hasOwnProperty(key)) {
      options[legacyOptions[key]] = options[key]
      delete options[key]
    }
  })
}

function createPxReplace (rootValue, unitPrecision, minPixelValue, onePxTransform) {
  return function (input) {
    return function (m, $1) {
      if (!$1) return m
      if (!onePxTransform && parseInt($1, 10) === 1) {
        return m
      }
      const pixels = parseFloat($1)
      if (pixels < minPixelValue) return m
      let val = pixels / rootValue(input, m, $1)
      if (unitPrecision >= 0 && unitPrecision <= 100) {
        val = toFixed(val, unitPrecision)
      }
      // 不带单位不支持在calc表达式中参与计算(https://github.com/NervJS/taro/issues/12607)
      return val + targetUnit
    }
  }
}

function toFixed (number, precision) {
  const multiplier = Math.pow(10, precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

function declarationExists (decls, prop, value) {
  return decls.some(function (decl) {
    return decl.prop === prop && decl.value === value
  })
}

function blacklistedSelector (blacklist, selector) {
  if (typeof selector !== 'string') return
  return blacklist.some(function (regex) {
    if (typeof regex === 'string') return selector.indexOf(regex) !== -1
    return selector.match(regex)
  })
}

function createPropListMatcher (propList) {
  const hasWild = propList.indexOf('*') > -1
  const matchAll = hasWild && propList.length === 1
  const lists = {
    exact: filterPropList.exact(propList),
    contain: filterPropList.contain(propList),
    startWith: filterPropList.startWith(propList),
    endWith: filterPropList.endWith(propList),
    notExact: filterPropList.notExact(propList),
    notContain: filterPropList.notContain(propList),
    notStartWith: filterPropList.notStartWith(propList),
    notEndWith: filterPropList.notEndWith(propList)
  }
  return function (prop) {
    if (matchAll) return true
    return (
      (
        hasWild ||
        lists.exact.indexOf(prop) > -1 ||
        lists.contain.some(function (m) {
          return prop.indexOf(m) > -1
        }) ||
        lists.startWith.some(function (m) {
          return prop.indexOf(m) === 0
        }) ||
        lists.endWith.some(function (m) {
          return prop.indexOf(m) === prop.length - m.length
        })
      ) &&
      !(
        lists.notExact.indexOf(prop) > -1 ||
        lists.notContain.some(function (m) {
          return prop.indexOf(m) > -1
        }) ||
        lists.notStartWith.some(function (m) {
          return prop.indexOf(m) === 0
        }) ||
        lists.notEndWith.some(function (m) {
          return prop.indexOf(m) === prop.length - m.length
        })
      )
    )
  }
}

module.exports.postcss = true
