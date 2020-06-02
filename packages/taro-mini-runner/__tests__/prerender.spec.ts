import * as fs from 'fs-extra'
import { detailMock, indexMock } from './fixtures/prerender/vmMock'

let compile
let getOutput

const fileType = {
  templ: '.wxml',
  style: '.wxss',
  config: '.json',
  script: '.js',
  xs: '.wxs'
}

jest.mock('vm2', () => ({
  NodeVM: jest.fn().mockImplementation(() => {
    return {
      run: jest.fn().mockImplementation((code) => {
        if (code.includes('others/detail/index')) {
          return cb => cb(detailMock)
        } else if (code.includes('pages/index/index')) {
          return cb => cb(indexMock)
        } else {
          return cb => cb({})
        }
      })
    }
  })
}))

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
