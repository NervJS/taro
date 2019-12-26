const cp = require('child_process')
const ghPages = require('gh-pages')
const ora = require('ora')
const spinner = ora('Publishing gitbooks...').start()

const docs = cp.spawn('npm', ['run', 'docs'])

docs.stdout.on('data', data => {
  console.log(data)
})

docs.stderr.on('data', data => {
  console.error(data)
})

docs.on('close', code => {
  if (code === 0) {
    ghPages.publish('./website/build/taro', err => {
      if (!err) {
        spinner.succeed('Publish successfully.')
      } else {
        spinner.fail(err)
      }
    })
  } else {
    spinner.fail(`文档站点编译出错，出错码 ${code}`)
  }
})

docs.on('error', error => {
  console.log(error)
})
