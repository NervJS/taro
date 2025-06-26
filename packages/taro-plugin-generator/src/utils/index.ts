/* eslint-disable no-console */
import { spawn } from 'node:child_process'
import * as path from 'node:path'

import type { IPluginContext } from '@tarojs/service'

export function execCommand(params: { command: string, args: string[], cwd: string }) {
  const { command, cwd, args } = params

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'pipe' })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      process.stdout.write(chunk)
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      process.stderr.write(chunk)
      stderr += chunk.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        const err = new Error(`Command failed with exit code ${code}\n${stderr}`)
        reject(err)
      }
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
}

export function readPkgJson(ctx: IPluginContext) {
  const { appPath } = ctx.paths
  const pkgPath = path.join(appPath, 'package.json')
  const pkgJson = require(pkgPath)
  return pkgJson
}

export function mergePkgJson(pkgJson: PackageJson, patch: PackageJson) {
  for (const propName in patch) {
    const origin = pkgJson[propName]
    pkgJson[propName] = Object.assign(origin ?? {}, patch[propName])
  }
}

export function removeIncompatiblePkg(pkgJson: PackageJson, pkgs: string[]) {
  for (const pkg of pkgs) {
    if (pkgJson.dependencies && pkg in pkgJson.dependencies) {
      Reflect.deleteProperty(pkgJson.dependencies, pkg)
    }
    if (pkgJson.devDependencies && pkg in pkgJson.devDependencies) {
      Reflect.deleteProperty(pkgJson.devDependencies, pkg)
    }
    if (pkgJson.peerDependencies && pkg in pkgJson.peerDependencies) {
      Reflect.deleteProperty(pkgJson.peerDependencies, pkg)
    }
  }
}

export async function installDeps(ctx: IPluginContext) {
  const { appPath } = ctx.paths
  const { fs } = ctx.helper
  const pnpmLockPath = `${appPath}/pnpm-lock.yaml`
  const yarnLockPath = `${appPath}/yarn.lock`

  let npm = 'npm'

  if (await fs.pathExists(pnpmLockPath)) {
    npm = 'pnpm'
  } else if (await fs.pathExists(yarnLockPath)) {
    npm = 'yarn'
  }

  return execCommand({ command: npm, args: ['install'], cwd: appPath })
}

export function getCompilerType(compilerConfig: IPluginContext['initialConfig']['compiler']) {
  return typeof compilerConfig === 'string' ? compilerConfig : compilerConfig?.type
}

export async function updatePkgJson(ctx: IPluginContext, patch: PackageJson) {
  const pkgJson = readPkgJson(ctx)
  mergePkgJson(pkgJson, patch)

  await ctx.helper.fs.outputJson(path.join(ctx.paths.appPath, 'package.json'), pkgJson, {
    encoding: 'utf-8',
    spaces: 2,
  })

  try {
    await installDeps(ctx)
    console.log(ctx.helper.chalk.green('\n✅ 安装依赖完成'))
  } catch {
    console.log(ctx.helper.chalk.red('\n❌ 安装依赖失败，请手动安装'))
  }
}
