import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, fs } from '@tarojs/helper'

import { RAWFILE_FOLDER } from '../utils'

import type { IPluginContext } from '@tarojs/service'

export default function registerCacheCommand(ctx: IPluginContext) {
  ctx.registerCommand({
    name: 'cache',
    optionsMap: {
      '--hdc': 'hdc 命令路径',
      '--paths': `缓存路径, 相对于包 ${RAWFILE_FOLDER} 需要缓存的文件地址 (default: ./)`,
      '--bundleName': '应用包名 (default: com.taro.examples)',
      '--moduleName': '应用模块名 (default: entry)',
      '--abilityName': '应用 Ability 名 (default: EntryAbility)',
    },
    synopsisList: [
      'taro --platform harmony_cpp cache --bundleName com.taro.examples --moduleName entry --abilityName EntryAbility',
    ],
    fn ({ options }) {
      const { appPath } = ctx.paths
      let outputRoot: string = ctx.runOpts?.config?.outputRoot || ''
      if (outputRoot.startsWith('.')) {
        outputRoot = path.resolve(appPath, outputRoot)
      }
      const { hdc, paths = './', bundleName = 'com.taro.examples', moduleName = 'entry', abilityName = 'EntryAbility' } = options

      generateCache({
        outputRoot,
        hdc,
        paths,
        bundleName,
        moduleName,
        abilityName,
      })
    },
  })
}

export function generateCache ({
  outputRoot,
  hdc,
  paths = './',
  bundleName = 'com.taro.examples',
  moduleName = 'entry',
  abilityName = 'EntryAbility',
}: {
  outputRoot: string
  hdc?: string
  paths?: string
  bundleName?: string
  moduleName?: string
  abilityName?: string
}) {
  const rawFilePath = path.resolve(outputRoot, '..', RAWFILE_FOLDER)

  let hdcShell = hdc
  let localHdcShell = ''
  try {
    if (!hdc) {
      localHdcShell = hdc || execSync(`${process?.platform === 'win32' ? 'where' : 'which'} hdc`).toString().replace(/\n/, '')
    }
  } catch (_) {
    localHdcShell = execSync(`echo $HARMONY_HOME/toolchains/hdc`).toString().replace(/\n/, '')
  }
  hdcShell = hdc || localHdcShell || '~/Library/Huawei/ohpm/bin/ohpm'

  // 启动应用
  execSync(`${hdcShell} shell aa start -b ${bundleName} -m ${moduleName} -a ${abilityName}`, { cwd: outputRoot, stdio: 'inherit' })

  // 获取缓存文件
  console.log(`\n${chalk.green(`获取 ${bundleName} 缓存文件\n`)}`) // eslint-disable-line no-console
  execSync(`${hdcShell} file recv /data/app/el2/100/base/${bundleName}/files/taro/js/ ../.harmony_v8cache`, { cwd: rawFilePath, stdio: 'inherit' })

  generateV8Cache(rawFilePath, path.resolve(rawFilePath, paths))

  fs.removeSync(path.resolve(rawFilePath, '..', '.harmony_v8cache'))
  console.log(`\n${chalk.green(`缓存完成`)}`) // eslint-disable-line no-console
}

export function generateV8Cache (rawFilePath: string, filePath: string) {
  const stat = fs.statSync(filePath)
  if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach((file) => {
      generateV8Cache(rawFilePath, path.join(filePath, file))
    })
  } else if (stat.isFile() && filePath.endsWith('.js')) {
    const cacheFile = path.join(path.join(rawFilePath, '..', '.harmony_v8cache'), path.relative(rawFilePath, filePath))
    if (fs.existsSync(cacheFile)) {
      const bundle = fs.readFileSync(cacheFile)
      fs.writeFileSync(`${filePath}.v8c`, bundle.subarray(8)) // Note: harmony uint64_t length is 8
    }
  }
}
