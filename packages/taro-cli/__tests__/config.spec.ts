import * as path from 'path'
import { run } from './utils'
import {
  getUserHomeDir,
  fs,
  TARO_CONFIG_FLODER,
  TARO_BASE_CONFIG
} from '@tarojs/helper'

jest.mock('@tarojs/helper', () => {
  const helper = jest.requireActual('@tarojs/helper')
  const fs = jest.requireActual('fs-extra')
  return {
    __esModule: true,
    ...helper,
    getUserHomeDir: jest.fn(),
    fs: {
      ...fs,
      existsSync: jest.fn(),
      readJSONSync: jest.fn(),
      writeJSONSync: jest.fn(),
      ensureFileSync: jest.fn()
    }
  }
})

const runConfig = run('config')

describe('config', () => {
  const getUserHomeDirMocked = getUserHomeDir as jest.Mock<any>
  const existsSyncMocked = fs.existsSync as jest.Mock<any>
  const readJSONSyncMocked = fs.readJSONSync as jest.Mock<any>
  const writeJSONSyncMocked = fs.writeJSONSync as jest.Mock<any>
  const ensureFileSyncMocked = fs.ensureFileSync as jest.Mock<any>

  beforeEach(() => {
    getUserHomeDirMocked.mockReturnValue('/')
    existsSyncMocked.mockReturnValue(true)
  })

  afterEach(() => {
    getUserHomeDirMocked.mockReset()
    existsSyncMocked.mockReset()
  })

  it('should exit because can\'t find home dir', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    getUserHomeDirMocked.mockReturnValue('')

    await runConfig('')

    expect(logSpy).toBeCalledWith('找不到用户根目录')
    logSpy.mockRestore()
  })

  it('should warn when getting config without args key', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runConfig('', { args: ['get'] })

    expect(logSpy).toBeCalledWith('Usage: taro config get <key>')
    logSpy.mockRestore()
  })

  it('should get config', async () => {
    const key = 'k'
    const value = 'v'
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    readJSONSyncMocked.mockImplementation(() => ({
      [key]: value
    }))

    await runConfig('', { args: ['get', key] })

    expect(logSpy).nthCalledWith(1, `Config path: ${configPath}`)
    expect(logSpy).nthCalledWith(2)
    expect(logSpy).nthCalledWith(3, `key: ${key}, value: ${value}`)

    logSpy.mockRestore()
    readJSONSyncMocked.mockReset()
  })

  it('should warn when getting config without args value', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runConfig('', { args: ['set', 'k'] })

    expect(logSpy).toBeCalledWith('Usage: taro config set <key> <value>')
    logSpy.mockRestore()
  })

  it('should set config', async () => {
    const key = 'k'
    const value = 'v'
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    readJSONSyncMocked.mockReturnValue({ a: 1 })

    await runConfig('', { args: ['set', key, value] })

    expect(writeJSONSyncMocked).toBeCalledWith(configPath, {
      a: 1,
      [key]: value
    })
    expect(logSpy).nthCalledWith(1, `Config path: ${configPath}`)
    expect(logSpy).nthCalledWith(2)
    expect(logSpy).nthCalledWith(3, `set key: ${key}, value: ${value}`)

    logSpy.mockRestore()
    readJSONSyncMocked.mockReset()
    writeJSONSyncMocked.mockClear()
  })

  it('should set config with init', async () => {
    const key = 'k'
    const value = 'v'
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    existsSyncMocked.mockReturnValue(false)

    await runConfig('', { args: ['set', key, value] })

    expect(ensureFileSyncMocked).toBeCalledWith(configPath)
    expect(writeJSONSyncMocked).toBeCalledWith(configPath, { [key]: value })
    expect(logSpy).toBeCalledWith(`set key: ${key}, value: ${value}`)

    logSpy.mockRestore()
    existsSyncMocked.mockReset()
    ensureFileSyncMocked.mockClear()
    writeJSONSyncMocked.mockClear()
  })

  it('should warn when deleting config without args key', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runConfig('', { args: ['delete'] })

    expect(logSpy).toBeCalledWith('Usage: taro config delete <key>')
    logSpy.mockRestore()
  })

  it('should delete config', async () => {
    const key = 'k'
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    readJSONSyncMocked.mockReturnValue({
      a: 1,
      [key]: 'v'
    })

    await runConfig('', { args: ['delete', key] })

    expect(writeJSONSyncMocked).toBeCalledWith(configPath, { a: 1 })
    expect(logSpy).nthCalledWith(1, `Config path: ${configPath}`)
    expect(logSpy).nthCalledWith(2)
    expect(logSpy).nthCalledWith(3, `deleted: ${key}`)

    logSpy.mockRestore()
    readJSONSyncMocked.mockReset()
    writeJSONSyncMocked.mockClear()
  })

  it('should list config', async () => {
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    readJSONSyncMocked.mockReturnValue({
      a: 1,
      b: 2
    })

    await runConfig('', { args: ['list'] })

    expect(logSpy).nthCalledWith(1, `Config path: ${configPath}`)
    expect(logSpy).nthCalledWith(2)
    expect(logSpy).nthCalledWith(3, 'Config info:')
    expect(logSpy).nthCalledWith(4, 'a=1')
    expect(logSpy).nthCalledWith(5, 'b=2')

    logSpy.mockRestore()
    readJSONSyncMocked.mockReset()
  })

  it('should list config in json', async () => {
    const configPath = path.join('/', `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    readJSONSyncMocked.mockReturnValue({
      a: 1,
      b: 2
    })

    await runConfig('', {
      args: ['list'],
      options: {
        json: true
      }
    })

    expect(logSpy).nthCalledWith(1, `Config path: ${configPath}`)
    expect(logSpy).nthCalledWith(2)
    expect(logSpy).nthCalledWith(3, 'Config info:')
    expect(logSpy).nthCalledWith(4, JSON.stringify({ a: 1, b: 2 }, null, 2))

    logSpy.mockRestore()
    readJSONSyncMocked.mockReset()
  })
})
