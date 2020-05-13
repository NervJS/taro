import * as fs from 'fs-extra'

let compile
let getOutput

const fileType = {
  templ: '.wxml',
  style: '.wxss',
  config: '.json',
  script: '.js',
  xs: '.wxs'
}

describe('prerender', () => {
  beforeAll(() => {
    jest.unmock('webpack')
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      const compiler = require('./utils/compiler')
      compile = compiler.compile
      getOutput = compiler.getOutput
    })
  })

  test('should prerender selected pages', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index']
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should mock global console', async () => {
    const log = jest.fn()

    await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/detail/index',
        mock: {
          console: {
            log
          }
        }
      }
    })

    expect(log).toBeCalled()
  })

  test('should console log message', async () => {
    const spy = jest.spyOn(console, 'log')

    await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/detail/index',
        console: true
      }
    })

    expect(spy).toHaveBeenCalledWith('mount')
    jest.restoreAllMocks()
  })

  test('should transform dom tree', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index'],
        transformData (data, { path }) {
          if (path === 'others/detail/index') {
            data.nn = 'video'
            data.cn = []
            data.src = 'https://pornhub.com/av8871239'
            return data
          }

          return data
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should transform result xml', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index'],
        transformXML (data, { path }, xml) {
          if (path === 'others/detail/index') {
            return '<video src="https://pornhub.com/av8871239" />'
          }

          return xml
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should throw error', async () => {
    const originLogError = console.error
    const logError = jest.fn()
    console.error = logError
    await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/normal/index'
      }
    })
    expect(logError).toHaveBeenCalledWith(new Error('初始化渲染没有任何数据。'))
    console.error = originLogError
  })
})
