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

import * as path from 'path'
import * as transformer from '../dist/index'

const App = `class HomeScreen extends React.Component {
  render () {
    return this.porps.children
  }
}`

function run () {
  const options = {
    projectRoot: path.resolve(__dirname),
    isEntryFile: () => { return true },
    nextTransformer: ({ src }) => { return src }
  }
  const code = transformer.transform({ src: App, filename: './src/app', options })
  return code
}

describe('app-loader', () => {
  it('app', () => {
    const result = run()
    expect(result).toMatchSnapshot()
  })
})
