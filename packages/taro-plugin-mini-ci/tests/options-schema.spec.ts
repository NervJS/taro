import { createRequire } from 'node:module'

import miniCI from '../src/index'

// 使用与 @tarojs/service 校验插件参数时相同的 joi
const joi = createRequire(require.resolve('@tarojs/service/package.json'))('joi')

function validate (opts) {
  let optsSchema
  const ctx = {
    addPluginOptsSchema: (schema) => {
      optsSchema = schema
    },
    registerCommand: () => {}
  }
  miniCI(ctx as any, opts)
  return optsSchema(joi).validate(opts)
}

describe('plugin options schema', () => {
  it.each([
    ['weapp', { appid: 'wx0000000000000000', privateKeyPath: 'private.key' }],
    ['alipay', { appid: '2021000000000000', toolId: 'tool-id', privateKeyPath: 'private.txt' }],
    ['alipay', { appid: '2021000000000000', toolId: 'tool-id', privateKey: 'private-key' }],
    ['swan', { token: 'token' }],
    ['dd', { appid: 'dd-appid', token: 'token' }]
  ])('accepts devToolsInstallPath for %s', (platform, config) => {
    const { error } = validate({
      [platform]: { ...config, devToolsInstallPath: 'D:\\Program Files\\devtools' }
    })
    expect(error).toBeUndefined()
  })
})
