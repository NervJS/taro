import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { exec } from 'child_process'

import registerReactNative from '../presets/platforms/rn'

import type { IPluginContext } from '@tarojs/service'

jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  exec: jest.fn()
}))

type Dependencies = Record<string, string>
interface PackageInfo {
  name?: string
  dependencies?: Dependencies
  devDependencies?: Dependencies
  peerDependencies?: Dependencies
  optionalDependencies?: Dependencies
  description?: string
}

const preset = '@react-native/babel-preset'
const legacyPreset = 'metro-react-native-babel-preset'
const presetArgument = '"@react-native/babel-preset@^0.73.18"'
const packageManagers = [
  { name: 'npm', locks: [], command: `npm install ${presetArgument} --save` },
  { name: 'yarn', locks: ['yarn.lock'], command: `yarn add ${presetArgument}` },
  { name: 'pnpm', locks: ['pnpm-lock.yaml'], command: `pnpm add ${presetArgument}` },
  { name: 'pnpm with both locks', locks: ['yarn.lock', 'pnpm-lock.yaml'], command: `pnpm add ${presetArgument}` }
]

function installedCore (reactNative = '^0.73.11'): PackageInfo {
  return {
    name: 'rn-platform-test',
    dependencies: {
      react: '^18.3.1',
      'react-native': reactNative,
      '@tarojs/taro-rn': '4.2.1',
      '@tarojs/rn-runner': '4.2.1',
      expo: '~50.0.21',
      '@react-native/metro-config': '^0.73.5'
    },
    devDependencies: {}
  }
}

async function settle () {
  await new Promise<void>(resolve => setImmediate(resolve))
}

describe('React Native platform dependency installation', () => {
  const execMock = exec as unknown as jest.Mock
  let appPath: string
  let packageText: string
  let runNative: jest.Mock
  let getNpmPkg: jest.Mock
  let logSpy: jest.SpyInstance
  let previousDevTag: string | undefined

  beforeEach(() => {
    appPath = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-rn-platform-'))
    runNative = jest.fn().mockResolvedValue(undefined)
    getNpmPkg = jest.fn().mockResolvedValue(runNative)
    execMock.mockReset().mockReturnValue({})
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    previousDevTag = process.env.DEVTAG
    delete process.env.DEVTAG
  })

  afterEach(async () => {
    await settle()
    logSpy.mockRestore()
    if (previousDevTag === undefined) delete process.env.DEVTAG
    else process.env.DEVTAG = previousDevTag
    for (const file of ['package.json', 'yarn.lock', 'pnpm-lock.yaml']) {
      const target = path.join(appPath, file)
      if (fs.existsSync(target)) fs.unlinkSync(target)
    }
    fs.rmdirSync(appPath)
  })

  async function start (packageInfo: PackageInfo, locks: string[] = []) {
    packageText = JSON.stringify(packageInfo, null, 2)
    fs.writeFileSync(path.join(appPath, 'package.json'), packageText)
    locks.forEach(lock => fs.writeFileSync(path.join(appPath, lock), ''))
    const registerPlatform = jest.fn()
    registerReactNative({
      paths: { appPath, nodeModulesPath: path.join(appPath, 'node_modules') },
      helper: { npm: { getNpmPkg } },
      runOpts: { options: {} },
      registerPlatform
    } as unknown as IPluginContext)
    expect(registerPlatform).toHaveBeenCalledTimes(1)
    const platform = registerPlatform.mock.calls[0][0]
    expect(platform.name).toBe('rn')
    expect(platform.useConfigName).toBe('rn')
    await platform.fn({ config: { platform: 'rn' } })
    await settle()
  }

  async function finishInstall (error: Error | null = null) {
    expect(execMock).toHaveBeenCalledTimes(1)
    const args = execMock.mock.calls[0]
    const callback = args[args.length - 1]
    expect(callback).toEqual(expect.any(Function))
    callback(error, '', '')
    await settle()
  }

  function expectRunner () {
    expect(getNpmPkg).toHaveBeenCalledTimes(1)
    expect(getNpmPkg).toHaveBeenCalledWith('@tarojs/rn-runner', appPath)
    expect(runNative).toHaveBeenCalledTimes(1)
    expect(runNative).toHaveBeenCalledWith(appPath, expect.objectContaining({
      entry: 'app',
      deviceType: 'android',
      buildAdapter: 'rn',
      nodeModulesPath: path.join(appPath, 'node_modules')
    }))
    expect(fs.readFileSync(path.join(appPath, 'package.json'), 'utf8')).toBe(packageText)
  }

  describe.each(packageManagers)('$name', ({ locks, command }) => {
    it('adds the preset to the default RN bootstrap before starting the runner', async () => {
      await start({ dependencies: {}, devDependencies: {} }, locks)
      expect(execMock).toHaveBeenCalledTimes(1)
      const [installCommand, options] = execMock.mock.calls[0]
      expect(installCommand.startsWith(command.split(' "')[0])).toBe(true)
      expect(installCommand).toContain(presetArgument)
      expect(installCommand).toContain('"react@^18.2.0"')
      expect(installCommand).toContain('"react-native@^0.73.1"')
      expect(installCommand).toContain('"@react-native/metro-config@^0.73.2"')
      expect(installCommand).toContain('"expo@~50.0.2"')
      expect(options).toEqual(expect.objectContaining({ cwd: appPath }))
      expect(getNpmPkg).not.toHaveBeenCalled()
      expect(runNative).not.toHaveBeenCalled()

      await finishInstall()
      expectRunner()
    })

    it('installs only the missing preset without forcing a core reinstall', async () => {
      await start(installedCore(), locks)
      expect(execMock).toHaveBeenCalledTimes(1)
      expect(execMock.mock.calls[0][0]).toBe(command)
      expect(execMock.mock.calls[0][0]).not.toContain('--force')
      expect(execMock.mock.calls[0][1]).toEqual(expect.objectContaining({ cwd: appPath }))
      expect(getNpmPkg).not.toHaveBeenCalled()

      await finishInstall()
      expectRunner()
    })
  })

  it.each([
    '0.73.1', '^0.73.1', '~0.73.5', '0.73.x', '0.73',
    '>=0.73.1 <0.74.0', '0.73.1 - 0.73.21', '^0.73.1 || ~0.73.10'
  ])('repairs a missing preset for the stable RN range %s', async range => {
    await start(installedCore(range))
    expect(execMock).toHaveBeenCalledTimes(1)
    expect(execMock.mock.calls[0][0]).toBe(`npm install ${presetArgument} --save`)
    await finishInstall()
    expectRunner()
  })

  it.each([
    '^0.72.0', '^0.74.0', '>=0.73.1', '*', '^0.73.1 || ^0.74.0',
    '>=0.74.0 <0.73.0', 'latest', 'not-a-version', 'npm:react-native@0.73.11',
    'workspace:^0.73.1', 'file:../react-native', 'git+https://github.com/facebook/react-native.git',
    '0.73.1-rc.0', '^0.73.0-rc.0', '>=0.73.0-rc.0 <0.74.0'
  ])('does not migrate the unsupported RN declaration %s', async range => {
    await start(installedCore(range))
    expect(execMock).not.toHaveBeenCalled()
    expectRunner()
  })

  it.each([
    { dependencies: '^0.73.1', devDependencies: '~0.73.5', install: true },
    { dependencies: '^0.73.1', devDependencies: '^0.74.0', install: false },
    { dependencies: '^0.74.0', devDependencies: '^0.73.1', install: false },
    { dependencies: '^0.73.1', devDependencies: '>=0.73.1', install: false },
    { dependencies: '^0.73.1', devDependencies: 'npm:react-native@0.73.11', install: false }
  ])('checks both RN declarations: $dependencies / $devDependencies', async versions => {
    const packageInfo = installedCore(versions.dependencies)
    packageInfo.devDependencies = { 'react-native': versions.devDependencies }
    await start(packageInfo)
    if (versions.install) {
      expect(execMock.mock.calls[0]?.[0]).toBe(`npm install ${presetArgument} --save`)
      await finishInstall()
    } else {
      expect(execMock).not.toHaveBeenCalled()
    }
    expectRunner()
  })

  describe.each(['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const)(
    'existing preset in %s', group => {
      it.each([preset, legacyPreset])('preserves an explicit %s declaration', async name => {
        const packageInfo = installedCore()
        packageInfo[group] = { ...packageInfo[group], [name]: '^0.73.8' }
        await start(packageInfo)
        expect(execMock).not.toHaveBeenCalled()
        expectRunner()
      })
    }
  )

  it('preserves projects declaring both preset packages', async () => {
    const packageInfo = installedCore()
    packageInfo.dependencies![preset] = '^0.73.21'
    packageInfo.devDependencies![legacyPreset] = '^0.72.8'
    await start(packageInfo)
    expect(execMock).not.toHaveBeenCalled()
    expectRunner()
  })

  it.each([preset, legacyPreset])('does not add or replace the declared %s preset during bootstrap', async name => {
    await start({
      dependencies: { react: '^18.3.1' },
      devDependencies: { [name]: '^0.73.8' }
    })
    expect(execMock).toHaveBeenCalledTimes(1)
    const command = execMock.mock.calls[0][0]
    expect(command).toContain('"react-native@^0.73.1"')
    expect(command).not.toContain(`"${preset}@`)
    expect(command).not.toContain(`"${legacyPreset}@`)
    expect(getNpmPkg).not.toHaveBeenCalled()
    await finishInstall()
    expectRunner()
  })

  it('preserves DEVTAG for Taro packages during the default bootstrap', async () => {
    process.env.DEVTAG = '@next'
    await start({ dependencies: {}, devDependencies: {} })
    expect(execMock).toHaveBeenCalledTimes(1)
    const command = execMock.mock.calls[0][0]
    for (const name of ['taro-rn', 'components-rn', 'rn-runner', 'rn-supporter', 'runtime-rn']) {
      expect(command).toContain(`"@tarojs/${name}@next"`)
    }
    expect(command).toContain('"react-native@^0.73.1"')
    expect(command).toContain(presetArgument)
    await finishInstall()
    expectRunner()
  })

  it('does not mistake a preset mentioned in a description for a dependency', async () => {
    const packageInfo = installedCore()
    packageInfo.description = `Previously used ${legacyPreset} or ${preset}`
    await start(packageInfo)
    expect(execMock.mock.calls[0]?.[0]).toBe(`npm install ${presetArgument} --save`)
    await finishInstall()
    expectRunner()
  })

  it.each(['dependencies', 'devDependencies'] as const)('handles core packages declared only in %s', async group => {
    const packageInfo = { [group]: installedCore().dependencies }
    await start(packageInfo)
    expect(execMock.mock.calls[0]?.[0]).toBe(`npm install ${presetArgument} --save`)
    await finishInstall()
    expectRunner()
  })

  it('bootstraps a manifest without dependency sections', async () => {
    await start({ name: 'new-rn-app' })
    expect(execMock).toHaveBeenCalledTimes(1)
    expect(execMock.mock.calls[0][0]).toContain(presetArgument)
    await finishInstall()
    expectRunner()
  })

  it.each(['bootstrap', 'preset repair'])('does not load the runner after a failed %s', async mode => {
    await start(mode === 'bootstrap' ? { dependencies: {}, devDependencies: {} } : installedCore())
    expect(getNpmPkg).not.toHaveBeenCalled()
    const error = new Error('package manager failed')
    await finishInstall(error)
    expect(getNpmPkg).not.toHaveBeenCalled()
    expect(runNative).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(error)
  })
})
