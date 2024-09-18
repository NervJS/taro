import * as path from 'node:path'

import { dotenvParse } from '@tarojs/helper'
import { Kernel } from '@tarojs/service'

import CLI from '../cli'

jest.mock('@tarojs/service')
const MockedKernel = Kernel as unknown as jest.Mock<Kernel>
const APP_PATH = path.join(__dirname, 'fixtures/default')

function setProcessArgv (cmd: string) {
  // @ts-ignore
  process.argv = [null, ...cmd.split(' ')]
}

describe('inspect', () => {
  let cli: CLI

  beforeAll(() => {
    cli = new CLI(APP_PATH)
  })

  beforeEach(() => {
    MockedKernel.mockClear()
    process.argv = []
    delete process.env.NODE_ENV
    delete process.env.TARO_ENV
    delete process.env.TARO_APP_TEST
    delete process.env.TARO_APP_ID
    delete process.env.JD_APP_TEST
    delete process.env.TARO_APP_DEFAULT
    delete process.env.TARO_APP_FOO
  })

  afterEach(() => {
    MockedKernel.mockClear()
    process.argv = []
    delete process.env.NODE_ENV
    delete process.env.TARO_ENV
    delete process.env.TARO_APP_TEST
    delete process.env.TARO_APP_ID
    delete process.env.JD_APP_TEST
    delete process.env.TARO_APP_DEFAULT
    delete process.env.TARO_APP_FOO
  })

  describe('cli mode env', () => {
    it('dotenvParse .env .env.dev should success', async () => {
      expect(process.env.TARO_test).toBeUndefined()
      dotenvParse(path.resolve(__dirname, 'env'), 'TARO_', 'dev')
      expect(process.env.TARO_test).toBe('123')
      expect(process.env._TARO_test).toBeUndefined()
    })

    it('--watch true => 默认加载 .env.development', async () => {
      setProcessArgv('taro build --watch --type weapp')
      await cli.run()
      expect(process.env.TARO_APP_TEST).toEqual('env-development')
      expect(process.env.TARO_APP_DEFAULT).toEqual('default')
    })

    it('--watch false => 默认加载 .env.production', async () => {
      setProcessArgv('taro build --type weapp')
      await cli.run()
      expect(process.env.TARO_APP_TEST).toEqual('env-production')
      expect(process.env.TARO_APP_DEFAULT).toEqual('default')
    })

    it('指定加载 .env.pre', async () => {
      setProcessArgv('taro build --type weapp --mode pre')
      await cli.run()
      expect(process.env.TARO_APP_TEST).toEqual('env-pre')
      expect(process.env.TARO_APP_DEFAULT).toEqual('default')
    })

    it('env.local 比 .env 优先级更高', async () => {
      setProcessArgv('taro build --type weapp --mode find404')
      await cli.run()
      expect(process.env.TARO_APP_TEST).toEqual('env-local')
      expect(process.env.TARO_APP_DEFAULT).toEqual('default')
    })

    it('env.uat.local 比 .env.uat 优先级更高', async () => {
      setProcessArgv('taro build --type weapp --mode uat')
      await cli.run()
      expect(process.env.TARO_APP_TEST).toEqual('env-uat-local')
      expect(process.env.TARO_APP_DEFAULT).toEqual('default')
    })

    it('自定义前缀: JD_APP_', async () => {
      setProcessArgv('taro build --type weapp --mode uat --env-prefix JD_APP_')
      await cli.run()
      expect(process.env.JD_APP_TEST).toEqual('env-uat')
      expect(process.env.TARO_APP_TEST).toEqual(undefined)
      expect(process.env.TARO_APP_ID).toEqual('特殊变量appid')
    })

    it('环境变量可以相互引用', async () => {
      setProcessArgv('taro build --type weapp --mode pre')
      await cli.run()
      expect(process.env.TARO_APP_FOO).toEqual('env-pre-foo')
    })
  })
})
