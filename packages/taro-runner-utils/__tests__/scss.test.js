/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import path from 'path'
import { getBundleResult, getBundleContent, getSassLoaderOption } from '../dist/index'

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
