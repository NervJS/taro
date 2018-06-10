var postcss = require('postcss')
var pxtorem = require('postcss-pxtorem')

const PLATFORM = {
  WEAPP: 'weapp',
  H5: 'h5'
}

const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}

const DEFAULT_H5_OPTIONS = {
  platform: 'h5',
  designWidth: 750,
  rootValue: 40,
  propList: ['*'] // enable all properties
}

const DEFAULT_WEAPP_OPTIONS = {
  platform: 'weapp',
  designWidth: 750,
  rootValue: 1,
  propList: ['*'] // enable all properties
}

module.exports = postcss.plugin('postcss-pxtransform', function (opts) {
  opts = opts || DEFAULT_WEAPP_OPTIONS

  return function (root, result) {
    switch (opts.platform) {
      case PLATFORM.WEAPP:
        return dealWithWeapp({root, result, opts})
      case PLATFORM.H5:
        return dealWithH5({root, result, opts})
    }
  }
})

function dealWithWeapp ({root, opts, result}) {
  opts = Object.assign({}, DEFAULT_WEAPP_OPTIONS, opts)
  return postcss(pxtorem(opts)).process(result)
    .then(newResult => {
      root = newResult.root
      root.walkDecls(function (decl) {
        let value = decl.value
        value = value.replace(/([0-9.]+)rem/ig, function (match, size) {
          return Math.ceil(size / DEVICE_RATIO[opts.designWidth] *
            10000) / 10000 + 'rpx'
        })
        decl.value = value
      })
    })
}

function dealWithH5 ({root, result, opts}) {
  opts = Object.assign({}, DEFAULT_H5_OPTIONS, opts)
  return postcss(pxtorem(opts)).process(result)
    .then(newResult => {
      result = newResult
    })
}
