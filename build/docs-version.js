const cp = require('child_process')
const ora = require('ora')
const spinner = ora('Update Docs Version...').start()
const pkgJSON = require('../packages/taro/package.json')

cp.exec(`npm run docs:version ${pkgJSON.version}`, err => {
  if (!err) {
    spinner.succeed(`Update docs version to ${pkgJSON.version} successfully.`)
  } else {
    spinner.fail(err)
  }
})
