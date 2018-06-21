const path = require('path')
const shelljs = require('shelljs')

const { version } = require('../package.json')
const { shouldUseYarn } = require('../src/util')
const Project = require('../src/project')

class GenerateLockfile extends Project {
  constructor () {
    super()
    this.conf = Object.assign(this.conf, {
      projectName: 'temp',
      template: 'default'
    })
  }

  copy () {
    const cwd = process.cwd()
    const {projectName, template} = this.conf
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
  const generateLockfile = new GenerateLockfile()
  generateLockfile.start()
}
