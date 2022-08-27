import { IPluginContext } from '@tarojs/service'
import * as minimist from 'minimist'

import AlipayCI from './AlipayCI'
import BaseCI, { CIOptions } from './BaseCi'
import DingtalkCI from './DingtalkCI'
import SwanCI from './SwanCI'
import TTCI from './TTCI'
import WeappCI from './WeappCI'

const enum EnumAction  {
  /** 自动打开预览工具 */
  'open' = 'open' ,
  /** 预览小程序（上传代码，作为“开发版”小程序） */
  'preview' = 'preview',
  /** 上传小程序（上传代码，可设置为“体验版”小程序） */
  'upload' = 'upload' ,
}

export { CIOptions } from './BaseCi'
export default (ctx: IPluginContext, _pluginOpts: CIOptions | (() => CIOptions)) => {
  const args = minimist(process.argv.slice(2), {
    boolean: [EnumAction.open,EnumAction.preview, EnumAction.upload]
  })
  const command = args._[0]

  // 参数验证，支持传入配置对象、返回配置对象的异步函数
  ctx.addPluginOptsSchema((joi) => {
    return joi.alternatives().try(
      joi.function().required(),
      joi
        .object()
        .keys({
          /** 微信小程序上传配置 */
          weapp: joi.object({
            appid: joi.string().required(),
            privateKeyPath: joi.string().required(),
            projectPath: joi.string(),
            type: joi.string().valid('miniProgram', 'miniProgramPlugin', 'miniGame', 'miniGamePlugin'),
            ignores: joi.array().items(joi.string().required()),
            robot: joi.number()
          }),
          /** 字节跳动小程序上传配置 */
          tt: joi.object({
            email: joi.string().required(),
            password: joi.string().required()
          }),
          /** 阿里小程序上传配置 */
          alipay:joi.alternatives().try(
            joi.object({
              appId: joi.string().required(),
              toolId: joi.string().required(),
              privateKeyPath: joi.string().required(),
              project: joi.string(),
              clientType: joi.string().valid('alipay', 'ampe', 'amap', 'genie', 'alios', 'uc', 'quark', 'taobao', 'koubei', 'alipayiot', 'cainiao', 'alihealth')
            }),
            joi.object({
              appId: joi.string().required(),
              toolId: joi.string().required(),
              privateKey: joi.string().required(),
              project: joi.string(),
              clientType: joi.string().valid('alipay', 'ampe', 'amap', 'genie', 'alios', 'uc', 'quark', 'taobao', 'koubei', 'alipayiot', 'cainiao', 'alihealth')
            }),

          ),
          /** 钉钉小程序配置 */
          dd: joi.object({
            token: joi.string().required(),
            appid: joi.string().required(),
            projectPath: joi.string(),
            devToolsInstallPath: joi.string(),
            projectType: joi.string().valid(
              'dingtalk-personal',
              'dingtalk-biz-isv',
              'dingtalk-biz',
              'dingtalk-biz-custom',
              'dingtalk-biz-worktab-plugin')
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
    )
  })

  const doAction = async (platform: string, action: EnumAction) => {
    const { printLog, processTypeEnum } = ctx.helper
    if (typeof platform !== 'string') {
      printLog(processTypeEnum.ERROR, '请传入正确的编译类型！')
      process.exit(0)
    }
    // 可通过异步函数获取插件选项
    const pluginOpts = typeof _pluginOpts === 'function' ? await _pluginOpts() : _pluginOpts
    let ci: BaseCI | null = null
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
      case 'dd':
        ci = new DingtalkCI(ctx, pluginOpts)
        break
      case 'swan':
        ci = new SwanCI(ctx, pluginOpts)
        break
    }
    if (!ci) {
      printLog(processTypeEnum.WARNING, `"@tarojs/plugin-mini-ci" 插件暂时不支持 "${platform}" 平台`)
      return
    }
    switch (action) {
      case EnumAction.open:
        ci.open()
        break
      case EnumAction.upload:
        ci.upload()
        break
      case EnumAction.preview:
        ci.preview()
        break
    }
  }

  // 构建小程序后执行
  if (command === 'build') {
    const onBuildDone = ctx.onBuildComplete || ctx.onBuildFinish
    onBuildDone(async () => {
      let action: EnumAction | null = null
      switch (true) {
        case args[EnumAction.open]:
          action = EnumAction.open
          break
        case args[EnumAction.preview]:
          action = EnumAction.preview
          break
        case args[EnumAction.upload]:
          action = EnumAction.upload
          break
      }
      if (action) {
        await doAction(ctx.runOpts.options.platform, action)
      }
    })
  }

  // 注册独立的命令，可直接上传构建后的代码
  [EnumAction.open, EnumAction.preview, EnumAction.upload].forEach(action => {
    ctx.registerCommand({
      name: action,
      optionsMap: {
        '--type [typeName]': `${action} type, weapp/swan/alipay/iot/tt`,
      },
      synopsisList: [
        `taro ${action} --type weapp`,
        `taro ${action} --type alipay`
      ],
      async fn ({options}) {
        doAction(options.type, action)
      }
    })
  })

}
