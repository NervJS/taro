/* eslint-disable no-console */
const { exec } = require('child_process')
const concurrently = require('concurrently')
const minimist = require('minimist')
const chalk = require('chalk')

/**
 * pnpm run debug
 * --projectPath /Users/taro/testapp
 * --packages @tarojs/shared,@tarojs/runtime
 * --unlink
 *
 * projectPath: 调试的项目
 * packages: 调试的包
 * unlink: 是否进行unlink，默认为link
 */

const args = minimist(process.argv.slice(2))
const { packages: packagesStr, projectPath, unlink } = args

const packages = packagesStr?.split(',') || []
const linkType = unlink ? 'unlink' : 'link'

function execCommand(command, successMessage, errorMessage) {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        console.error(chalk.red(errorMessage), error)
        return reject(error)
      }
      console.log(chalk.green(successMessage))
      resolve()
    })
  })
}

function linkToGlobal() {
  return Promise.all(packages.map(pkg =>
    execCommand(
      `pnpm --filter ${pkg} exec yarn ${linkType}`,
      `已在全局将${pkg} ${linkType}`,
      `yarn ${linkType} ${pkg} 出错`
    )
  ))
}

function linkToLocal() {
  return Promise.all(packages.map(pkg =>
    execCommand(
      `cd ${projectPath} && yarn ${linkType} ${pkg}`,
      `已在项目中将${pkg} ${linkType}`,
      `yarn ${linkType} ${pkg} 出错`
    )
  ))
}

function forceInstall() {
  console.log(chalk.green('正在项目中为您安装unlink的包...'))
  return execCommand(
    `cd ${projectPath} && yarn install --force`,
    `已在项目中为您安装unlink的包`,
    `yarn install --force 出错`
  )
}

function runDevConcurrently() {
  const excludePkg = ['@tarojs/taro']
  const commands = packages.filter(pkg => !excludePkg.includes(pkg)).map(pkg => {
    const devMap = {
      '@tarojs/components': 'dev:components'
    }
    return `pnpm --filter ${pkg} run ${devMap[pkg] || 'dev'}`
  })

  if (!commands.length) return

  const { result } = concurrently(commands, {
    prefix: 'name',
    killOthers: ['failure', 'success'],
  })

  return result.catch((error) => {
    console.error(chalk.red('自动编译出错:'), error)
  })
}

async function main() {
  if (!projectPath || !packages?.length) {
    console.error(chalk.red('参数错误~'))
    return
  }

  try {
    if (unlink) {
      await linkToLocal()
      await linkToGlobal()
      await forceInstall()
    } else {
      await linkToGlobal()
      await linkToLocal()
      await runDevConcurrently()
    }
  } catch (error) {
    console.error(chalk.red('工作流执行出错:'), error)
  }
}

main()
