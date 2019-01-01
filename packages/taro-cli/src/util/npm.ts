import * as resolvePath from 'resolve'
import * as spawn from 'cross-spawn'
import chalk from 'chalk'

import * as Util from './'
import { IInstallOptions } from './types'

const basedir = process.cwd()
const PEERS = /UNMET PEER DEPENDENCY ([a-z\-0-9.]+)@(.+)/gm
const npmCached = {}

const erroneous: string[] = []

type pluginFunction = (pluginName: string, content: string | null, file: string, config: object) => any

const defaultInstallOptions: IInstallOptions = {
  dev: false,
  peerDependencies: true
}

export const taroPluginPrefix = '@tarojs/plugin-'

export function resolveNpm (pluginName: string): Promise<string> {
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

export function resolveNpmSync (pluginName: string): string {
  try {
    if (!npmCached[pluginName]) {
      const res = resolvePath.sync(pluginName, {basedir})
      return res
    }
    return npmCached[pluginName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${pluginName}，开始安装...`))
      const installOptions: IInstallOptions = {
        dev: false
      }
      if (pluginName.indexOf(taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(pluginName, installOptions)
      return resolveNpmSync(pluginName)
    }
    return ''
  }
}

export function installNpmPkg (pkgList: string[] | string, options: IInstallOptions) {
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
  let args: string[] = []

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
  let matches: RegExpExecArray | null = null
  const peers: string[] = []

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

export const callPlugin: pluginFunction = async (pluginName: string, content: string | null, file: string, config: object) => {
  const pluginFn = await getNpmPkg(`${taroPluginPrefix}${pluginName}`)
  return pluginFn(content, file, config)
}

export const callPluginSync: pluginFunction = (pluginName: string, content: string | null, file: string, config: object) => {
  const pluginFn = getNpmPkgSync(`${taroPluginPrefix}${pluginName}`)
  return pluginFn(content, file, config)
}

export function getNpmPkgSync (npmName: string) {
  const npmPath = resolveNpmSync(npmName)
  const npmFn = require(npmPath)
  return npmFn
}

export async function getNpmPkg (npmName: string) {
  let npmPath
  try {
    npmPath = resolveNpmSync(npmName)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${npmName}，开始安装...`))
      const installOptions: IInstallOptions = {
        dev: false
      }
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
