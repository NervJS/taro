/*!
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
import { CLIEngine } from 'eslint'
import * as glob from 'glob'

export default function ({ projectConfig }) {
  const appPath = process.cwd()
  const globPattern = glob.sync(path.join(appPath, '.eslintrc*'))

  const eslintCli = new CLIEngine({
    cwd: process.cwd(),
    useEslintrc: Boolean(globPattern.length),
    baseConfig: {
      extends: [`taro/${projectConfig.framework}`]
    }
  })

  const sourceFiles = path.join(process.cwd(), projectConfig.sourceRoot, '**/*.{js,ts,jsx,tsx}')
  const report = eslintCli.executeOnFiles([sourceFiles])
  const formatter = eslintCli.getFormatter()

  return {
    desc: '检查 ESLint (以下为 ESLint 的输出)',
    raw: formatter(report.results)
  }
}
