import { chalk, fs } from '@tarojs/helper'
import path from 'path'

import { HARMONY_SCOPES } from './constants'

export function isHarmonyRequest (request: string): boolean {
  return HARMONY_SCOPES.some(scope => scope.test(request))
}

export function modifyHarmonyConfig (route, { projectPath, hapName, jsFAName }) {
  const hapConfigPath = path.join(projectPath, hapName, 'src/main/config.json')
  fs.readJson(hapConfigPath)
    .then(config => {
      config.module.js ||= []
      const jsFAs = config.module.js
      const target = jsFAs.find(item => item.name === jsFAName)
      if (target) {
        if (JSON.stringify(target.pages) === JSON.stringify(route)) return
        target.pages = route
        target.window = {
          designWidth: 750,
          autoDesignWidth: false
        }
      } else {
        jsFAs.push({
          pages: route,
          name: jsFAName,
          window: {
            designWidth: 750,
            autoDesignWidth: false
          }
        })
      }
      return fs.writeJson(hapConfigPath, config, { spaces: 2 })
    })
    .catch(err => {
      console.warn(chalk.red('设置鸿蒙 Hap 配置失败：', err))
    })
}

export async function modifyHostPackageDep (dest: string) {
  const hmsDeps = {
    '@hmscore/hms-js-base': '^6.1.0-300',
    '@hmscore/hms-jsb-account': '^1.0.300'
  }
  const packageJsonFile = path.resolve(dest, '../../../../../package.json')

  const isExists = await fs.pathExists(packageJsonFile)
  if (!isExists) return

  const data = await fs.readFile(packageJsonFile)
  let packageJson: any = data.toString()

  packageJson = JSON.parse(packageJson)
  if (!packageJson.dependencies) {
    packageJson.dependencies = hmsDeps
  } else {
    for (const hmsDep in hmsDeps) {
      packageJson.dependencies[hmsDep] = hmsDeps[hmsDep]
    }
  }
  packageJson = JSON.stringify(packageJson)

  await fs.writeFile(packageJsonFile, packageJson)
}
