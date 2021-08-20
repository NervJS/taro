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

const path = require('path')
const shelljs = require('shelljs')

const { version } = require('../package.json')
const { shouldUseYarn } = require('../dist/util')
const Project = require('../dist/create/project').default

class GenerateLockfile extends Project {
  copy () {
    const cwd = process.cwd()
    const { projectName, template } = this.conf
    const lockfileDir = path.join(this.templatePath(), template, 'yarn-lockfiles')
    shelljs.cd(cwd)
    shelljs.rm('-rf', lockfileDir)
    shelljs.mkdir('-p', lockfileDir)
    shelljs.cp('-r', `${projectName}/yarn.lock`, `${lockfileDir}/${version}-yarn.lock`)
    shelljs.rm('-rf', projectName)
  }

  start () {
    this.write(this.copy.bind(this))
  }
}

if (shouldUseYarn) {
  const generateLockfile = new GenerateLockfile({
    projectName: 'temp',
    template: 'default',
    typescript: false,
    env: 'test'
  })
  generateLockfile.start()
}
