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

import * as path from 'path'

import { transform } from '../src/index'

const Home = `import './app.scss';
import * as React from 'React'
class HomeScreen extends React.Component {
  render () {
    return null
  }
}`

const Page = `
import * as React from 'React'
class HomeScreen extends React.Component {
  render () {
    return null
  }
}
`

function run () {
  const options = {
    projectRoot: path.resolve(__dirname),
    isEntryFile: () => { return false },
    nextTransformer: ({ src }) => { return src }
  }
  const commonPath = path.join(path.resolve(__dirname), 'src/app.scss')
  const arr = [{
    name: '',
    path: commonPath,
    fileName: 'app.scss'
  }]
  // @ts-ignore
  global.__taroCommonStyle = arr
  // @ts-ignore
  global.__taroAppPages = ['src/pages']
  const code = transform({ src: Page, filename: 'src/pages', options })
  return code
}

describe('page-loader', () => {
  it('page', () => {
    const result = run()
    expect(result).toMatch(Home)
  })
})
