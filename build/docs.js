const cp = require('child_process')
const ghPages = require('gh-pages')
const ora = require('ora')
const spinner = ora('Publishing gitbooks...').start()

cp.exec('npm run docs', err => {
  if (!err) {
    ghPages.publish('./website/build/taro', err => {
      if (!err) {
        spinner.succeed('Publish successfully.')
      } else {
        spinner.fail(err)
      }
    })
  } else {
    spinner.fail(err)
  }
})
