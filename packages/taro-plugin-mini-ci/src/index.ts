import { IPluginContext } from '@tarojs/service'
import * as minimist from 'minimist'

import AlipayCI from './AlipayCI'
import { CIOptions } from './BaseCi'
import SwanCI from './SwanCI'
import TTCI from './TTCI'
import WeappCI from './WeappCI'

export { CIOptions } from './BaseCi'
export default (ctx: IPluginContext, pluginOpts: CIOptions) => {
  const onBuildDone = ctx.onBuildComplete || ctx.onBuildFinish

  ctx.addPluginOptsSchema((joi) => {
    return joi
      .object()
      .keys({
        /** 微信小程序上传配置 */
        weapp: joi.object({
          appid: joi.string().required(),
          projectPath: joi.string(),
          privateKeyPath: joi.string().required(),
          type: joi.string().valid('miniProgram', 'miniProgramPlugin', 'miniGame', 'miniGamePlugin'),
          ignores: joi.array().items(joi.string().required())
        }),
        /** 字节跳动小程序上传配置 */
        tt: joi.object({
          email: joi.string().required(),
          password: joi.string().required()
        }),
        /** 阿里小程序上传配置 */
        alipay: joi.object({
          appId: joi.string().required(),
          toolId: joi.string().required(),
          privateKeyPath: joi.string().required(),
          proxy: joi.string(),
          clientType: joi.string().valid('alipay', 'ampe', 'amap', 'genie', 'alios', 'uc', 'quark', 'taobao', 'koubei', 'alipayiot', 'cainiao', 'alihealth')
        }),
        /** 百度小程序上传配置 */
        swan: joi.object({
          token: joi.string().required(),
          minSwanVersion: joi.string()
        }),
        version: joi.string(),
        desc: joi.string()
      })
      .required()
  })

  onBuildDone(async () => {
    const args = minimist(process.argv.slice(2), {
      boolean: ['open', 'upload', 'preview']
    })
    const { printLog, processTypeEnum } = ctx.helper
    const platform = ctx.runOpts.options.platform
    let ci
    switch (platform) {
      case 'weapp':
        ci = new WeappCI(ctx, pluginOpts)
        break
      case 'tt':
        ci = new TTCI(ctx, pluginOpts)
        break
      case 'alipay':
      case 'iot':
        ci = new AlipayCI(ctx, pluginOpts)
        break
      case 'swan':
        ci = new SwanCI(ctx, pluginOpts)
        break
      default:
        break
    }
    if (!ci) {
      printLog(processTypeEnum.WARNING, `"@tarojs/plugin-mini-ci" 插件暂时不支持 "${platform}" 平台`)
      return
    }
    switch (true) {
      case args.open:
        ci.open()
        break
      case args.upload:
        ci.upload()
        break
      case args.preview:
        ci.preview()
        break
      default:
        break
    }
  })
}
