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
 *  SOFTWARE.
 */

import * as path from 'path'

import { getBundleContent, getBundleResult, getSassLoaderOption } from '../dist/index'

describe('getBundleResult', () => {
  const filePath = path.resolve(__dirname, '.', 'styles/variables.scss')
  const fileConfig = {
    name: 'styles/variables.scss',
    path: path.resolve(__dirname, '.')
  }

  test('test file path', async () => {
    const res = await getBundleResult(filePath)
    expect(res.bundledContent).toMatchSnapshot()
  })

  test('test file name and project directory path', async () => {
    const res = await getBundleResult(fileConfig.name, fileConfig.path)
    expect(res.bundledContent).toMatchSnapshot()
  })
})

describe('getBundleContent', () => {
  const sassResourcePath = {
    resource: path.resolve(__dirname, '.', 'styles/variables.scss')
  }
  const sassResourcePathWithDirectory = {
    resource: 'styles/variables.scss',
    projectDirectory: path.resolve(__dirname, '.')
  }
  const sassResourceArray = {
    resource: [
      path.resolve(__dirname, '.', 'styles/variables.scss'),
      path.resolve(__dirname, '.', 'styles/mixins.scss')
    ]
  }
  const sassResourceArrayWithDirectory = {
    resource: [
      'styles/variables.scss',
      'styles/mixins.scss'
    ],
    projectDirectory: path.resolve(__dirname, '.')
  }

  test('test sass resource path', async () => {
    const data = sassResourcePath
    const res = await getBundleContent(data.resource)
    expect(res).toMatchSnapshot()
  })
  test('test sass resource path with directory', async () => {
    const data = sassResourcePathWithDirectory
    const res = await getBundleContent(data.resource, data.projectDirectory)
    expect(res).toMatchSnapshot()
  })

  test('test sass resource array', async () => {
    const data = sassResourceArray
    const res = await getBundleContent(data.resource)
    expect(res).toMatchSnapshot()
  })
  test('test sass resource array with directory', async () => {
    const data = sassResourceArrayWithDirectory
    const res = await getBundleContent(data.resource, data.projectDirectory)
    expect(res).toMatchSnapshot()
  })
})

describe('getSassLoaderOption', () => {
  const buildConfig = {
    publicPath: '/',
    staticDirectory: 'static',
    deviceRatio: { 640: 1.17, 750: 1, 828: 0.905 },
    designWidth: 750,
    outputRoot: 'dist',
    sass: {
      resource: [
        'styles/variables.scss',
        'styles/mixins.scss'
      ],
      projectDirectory: path.resolve(__dirname, '.')
    },
    sassLoaderOption: {
      implementation: 'dart-sass'
    },
    sourceRoot: 'src'
  }

  test('test get sass loader option', async () => {
    const res = await getSassLoaderOption(buildConfig)
    expect(res).toMatchSnapshot()
  })
})
