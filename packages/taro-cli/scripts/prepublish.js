/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
