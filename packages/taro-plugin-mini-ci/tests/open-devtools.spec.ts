import * as crypto from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import * as path from 'node:path'

import SwanCI from '../src/SwanCI'
import WeappCI from '../src/WeappCI'

jest.mock('../src/utils/npm', () => ({
  getNpmPkgSync: () => ({ Project: class {} }),
  resolveNpmSync: () => ''
}))

let root: string | null = null

afterEach(() => {
  if (root) {
    rmSync(root, { recursive: true, force: true })
    root = null
  }
})

function setup () {
  // 目录名带空格，模拟 C:\Program Files (x86)\... 这类默认安装路径
  root = mkdtempSync(path.join(tmpdir(), 'taro mini ci '))
  const projectPath = path.join(root, 'my app', 'dist')
  const argsFile = path.join(root, 'args.txt')
  mkdirSync(projectPath, { recursive: true })
  writeFileSync(path.join(root, 'package.json'), '{}')
  writeFileSync(path.join(root, 'private.key'), '')
  const ctx = {
    paths: { appPath: root },
    helper: {
      fs: {
        readFileSync,
        readFile,
        pathExists: async (p: string) => existsSync(p),
        pathExistsSync: existsSync
      },
      chalk: { red: (s: string) => s },
      printLog: () => {},
      processTypeEnum: {},
      getUserHomeDir: () => root
    }
  }
  // 假的开发者工具命令行：把收到的参数写入 args.txt
  const createCli = (installPath: string) => {
    mkdirSync(installPath, { recursive: true })
    writeFileSync(path.join(installPath, 'cli.bat'), `@echo %*> "${argsFile}"\r\n`)
  }
  return { root, projectPath, argsFile, ctx, createCli }
}

describe('weapp devToolsInstallPath', () => {
  it('keeps the configured path for the next build in watch mode', () => {
    const { root, ctx } = setup()
    const installPath = path.join(root, 'devtools')
    // watch 模式下每次构建都会用同一份插件配置创建新的 WeappCI
    const pluginOpts = {
      weapp: { appid: 'wx0000000000000000', privateKeyPath: 'private.key', devToolsInstallPath: installPath }
    }

    for (let build = 0; build < 2; build++) {
      const ci = new WeappCI(ctx as any, pluginOpts)
      ci.init()
      expect((ci as any).devToolsInstallPath).toBe(installPath)
    }
    expect(pluginOpts.weapp.devToolsInstallPath).toBe(installPath)
  })
})

const describeOnWindows = process.platform === 'win32' ? describe : describe.skip

describeOnWindows('open devtools on Windows', () => {
  it('weapp: works when the install path and project path contain spaces', async () => {
    const { root, projectPath, argsFile, ctx, createCli } = setup()
    const installPath = path.join(root, 'Program Files (x86)', 'Tencent', '微信web开发者工具')
    createCli(installPath)
    const md5 = crypto.createHash('md5').update(installPath).digest('hex')
    const ideStatusDir = path.join(root, 'AppData', 'Local', '微信开发者工具', 'User Data', md5, 'Default')
    mkdirSync(ideStatusDir, { recursive: true })
    writeFileSync(path.join(ideStatusDir, '.ide-status'), 'On')

    const ci = new WeappCI(ctx as any, {
      weapp: { appid: 'wx0000000000000000', privateKeyPath: 'private.key', devToolsInstallPath: installPath }
    })
    ci.setProjectPath(projectPath)
    ci.init()
    await ci.open()

    expect(readFileSync(argsFile, 'utf8').trim()).toBe(`open --project "${projectPath}"`)
  })

  it('swan: works when the install path and project path contain spaces', async () => {
    const { root, projectPath, argsFile, ctx, createCli } = setup()
    const installPath = path.join(root, 'Program Files', 'swan-ide-gui')
    createCli(installPath)

    const ci = new SwanCI(ctx as any, { swan: { token: 'token', devToolsInstallPath: installPath } })
    ci.setProjectPath(projectPath)
    await ci.open()

    expect(readFileSync(argsFile, 'utf8').trim()).toBe(`--project-path "${projectPath}"`)
  })
})
