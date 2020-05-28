import { isNodeModule, isTaroModule, getEsnextModuleRules, getModule } from '../util/chain'

describe('Regs', () => {
  it('should recognize "node_modules"', () => {
    expect(isNodeModule('/node_modules/taro-ui')).toEqual(true)
    expect(isNodeModule('/pages/index/index')).toEqual(false)
  })

  it('should recognize taro modules', () => {
    expect(isTaroModule('/node_modules/taro-ui')).toEqual(false)
    expect(isTaroModule('/node_modules/@tarojs/components')).toEqual(true)
    expect(isTaroModule('/node_modules/@tarojs/taro-h5')).toEqual(false)
  })

  it('should recognize esnextModules', () => {
    const esnextModules = ['taro-ui', '@jd/jd-ui']
    const esnextModuleRules = getEsnextModuleRules(esnextModules)
    const isEsnextModules = (filename: string) => esnextModuleRules.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(filename)
      } else {
        return filename.indexOf(pattern) > -1
      }
    })
    expect(isEsnextModules('node_modules/taro-ui/dist/...')).toEqual(true)
    expect(isEsnextModules('node_modules/@jd/jd-ui/src/...')).toEqual(true)
    expect(isEsnextModules('node_modules/taro-ui2/dist/...')).toEqual(true)
    expect(isEsnextModules('node_modules/tarojs-ui/dist/...')).toEqual(false)
  })

  it('should get a correct webpackConfig.module object', () => {
    const chain = {}
    const { rule } = getModule('', {
      staticDirectory: '',
      designWidth: 750,
      deviceRatio: '',
      enableExtract: true,
      enableSourceMap: true,

      styleLoaderOption: {},
      cssLoaderOption: {},
      fontUrlLoaderOption: {},
      imageUrlLoaderOption: {},
      mediaUrlLoaderOption: {},
      esnextModules: [],

      postcss: {},
      babel: {}
    }, chain)
    expect(rule.css).toMatchObject({
      test: /\.(css|s[ac]ss|less|styl)\b/,
      oneOf: expect.any(Array)
    })
    expect(rule.postcss).toMatchObject({
      test: /\.(css|s[ac]ss|less|styl)\b/,
      use: expect.any(Array),
      exclude: expect.any(Array)
    })
    expect(rule.taroStyle).toMatchObject({
      test: /\.(css|s[ac]ss|less|styl)\b/,
      enforce: 'post',
      use: expect.any(Array),
      include: expect.any(Array)
    })
    expect(rule.customStyle).toMatchObject({
      test: /\.(css|s[ac]ss|less|styl)\b/,
      enforce: 'post',
      use: expect.any(Array),
      exclude: expect.any(Array)
    })
    expect(rule.jsx).toMatchObject({
      test: /\.jsx?$/,
      use: {
        babelLoader: expect.anything()
      }
    })
    expect(rule.media).toMatchObject({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: {
        urlLoader: expect.anything()
      }
    })
    expect(rule.font).toMatchObject({
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        urlLoader: expect.anything()
      }
    })
    expect(rule.image).toMatchObject({
      test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
      use: {
        urlLoader: expect.anything()
      }
    })
  })

})
