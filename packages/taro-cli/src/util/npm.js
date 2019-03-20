const resolvePath = require('resolve')
const spawn = require('cross-spawn')
const chalk = require('chalk')

const Util = require('./')

const basedir = process.cwd()
const taroPluginPrefix = '@tarojs/plugin-'
const PEERS = /UNMET PEER DEPENDENCY ([a-z\-0-9.]+)@(.+)/gm
const npmCached = {}
const erroneous = []
const defaultInstallOptions = {
  dev: false,
  peerDependencies: true
}

function resolveNpm (pluginName) {
  if (!npmCached[pluginName]) {
    return new Promise((resolve, reject) => {
      resolvePath(`${pluginName}`, {basedir}, (err, res) => {
        if (err) {
          return reject(err)
        }
        npmCached[pluginName] = res
        resolve(res)
      })
    })
  }
  return Promise.resolve(npmCached[pluginName])
}

function resolveNpmSync (pluginName) {
  try {
    if (!npmCached[pluginName]) {
      const res = resolvePath.sync(pluginName, {basedir})
      return res
    }
    return npmCached[pluginName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${pluginName}，开始安装...`))
      const installOptions = {}
      if (pluginName.indexOf(taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(pluginName, installOptions)
      return resolveNpmSync(pluginName)
    }
  }
}

function installNpmPkg (pkgList, options) {
  if (!pkgList) {
    return
  }
  if (!Array.isArray(pkgList)) {
    pkgList = [pkgList]
  }
  pkgList = pkgList.filter(dep => {
    return erroneous.indexOf(dep) === -1
  })

  if (!pkgList.length) {
    return
  }
  options = Object.assign({}, defaultInstallOptions, options)
  let installer = ''
  let args = []

  if (Util.shouldUseYarn()) {
    installer = 'yarn'
  } else if (Util.shouldUseCnpm()) {
    installer = 'cnpm'
  } else {
    installer = 'npm'
  }

  if (Util.shouldUseYarn()) {
    args = ['add'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('-D')
    }
  } else {
    args = ['install'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('--save-dev')
    } else {
      args.push('--save')
    }
  }
  const output = spawn.sync(installer, args, {
    stdio: ['ignore', 'pipe', 'inherit']
  })
  if (output.status) {
    pkgList.forEach(dep => {
      erroneous.push(dep)
    })
  }
  let matches = null
  const peers = []

  while ((matches = PEERS.exec(output.stdout))) {
    const pkg = matches[1]
    const version = matches[2]
    if (version.match(' ')) {
      peers.push(pkg)
    } else {
      peers.push(`${pkg}@${version}`)
    }
  }
  if (options.peerDependencies && peers.length) {
    console.info('正在安装 peerDependencies...')
    installNpmPkg(peers, options)
  }
  return output
}

async function callPlugin (pluginName, content, file, config) {
  const pluginFn = await getNpmPkg(`${taroPluginPrefix}${pluginName}`)
  return pluginFn(content, file, config)
}

function callPluginSync (pluginName, content, file, config) {
  const pluginFn = getNpmPkgSync(`${taroPluginPrefix}${pluginName}`)
  return pluginFn(content, file, config)
}

function getNpmPkgSync (npmName) {
  const npmPath = resolveNpmSync(npmName)
  const npmFn = require(npmPath)
  return npmFn
}

async function getNpmPkg (npmName) {
  let npmPath
  try {
    npmPath = resolveNpmSync(npmName)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${npmName}，开始安装...`))
      const installOptions = {}
      if (npmName.indexOf(taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(npmName, installOptions)
      npmPath = await resolveNpm(npmName)
    }
  }
  const npmFn = require(npmPath)
  return npmFn
}

module.exports = {
  taroPluginPrefix,
  installNpmPkg,
  resolveNpm,
  resolveNpmSync,
  callPlugin,
  callPluginSync,
  getNpmPkg,
  getNpmPkgSync
}
