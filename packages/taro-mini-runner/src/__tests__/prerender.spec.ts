/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
    jest.resetModules()
    const compiler = require('./utils/compiler')
    compile = compiler.compile
    getOutput = compiler.getOutput
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
    const assets = stats.toJson().assets || []

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
            data.src = 'https://github.com/taro'
            return data
          }

          return data
        }
      }
    })
    const assets = stats.toJson().assets || []

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
        transformXML (_data, { path }, xml) {
          if (path === 'others/detail/index') {
            return '<video src="https://github.com/taro" />'
          }

          return xml
        }
      }
    })
    const assets = stats.toJson().assets || []

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
