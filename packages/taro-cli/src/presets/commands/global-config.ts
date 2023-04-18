import * as ora from 'ora'
import * as path from 'path'

import { execCommand, getRootPath } from '../../util'

import type { IPluginContext } from '@tarojs/service'

type TPluginAction = 'install' | 'uninstall'

const PLUGIN_COMMAND_TIPS_MAP = {
  install: '添加',
  uninstall: '删除'
}

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'global-config',
    synopsisList: [
      'taro global-config add-plugin [pluginName]',
      'taro global-config remove-plugin [pluginName]',
      'taro global-config reset',
    ],
    optionsMap: {
      '-h, --help': 'output usage information'
    },
    fn ({ _ }) {
      const [, action, pluginName] = _
      const { getUserHomeDir, TARO_GROBAL_PLUGIN_CONFIG_DIR, fs, TARO_GLOBAL_PLUGIN_CONFIG_FILE } = ctx.helper
      const homedir = getUserHomeDir()
      const globalPluginConfigDir = path.join(homedir, TARO_GROBAL_PLUGIN_CONFIG_DIR)
      if (!homedir) return console.log('找不到用户根目录')
      const rootPath = getRootPath()
      const templatePath = path.join(rootPath, 'templates', 'global-config')
      function makeSureConfigExists () {
        if(!fs.existsSync(globalPluginConfigDir)){
          const spinner = ora(`目录不存在，全局配置初始化`).start()
          try {
            fs.copySync(templatePath, globalPluginConfigDir)
            spinner.succeed(`全局配置初始化成功，${globalPluginConfigDir}`)
          } catch (e) {
            spinner.fail(`全局配置初始化失败，${e}`)
            process.exit(1)
          }

        }
      }
      function addOrRemovePlugin (actionType: TPluginAction) {
        const tips = PLUGIN_COMMAND_TIPS_MAP[actionType]
        const spinner = ora(`开始${tips}插件 ${pluginName}`).start()
        execCommand({
          command: `cd ${globalPluginConfigDir} && npm ${actionType} ${pluginName}`,
          successCallback (data) {
            console.log(data.replace(/\n$/, ''))
            spinner.start('开始修改插件配置')
            const configFilePath = path.join(globalPluginConfigDir, TARO_GLOBAL_PLUGIN_CONFIG_FILE)
            let pluginList
            try {
              pluginList = JSON.parse(String(fs.readFileSync(configFilePath)))?.plugins || []
            } catch (e){
              spinner.fail('获取配置文件失败')
            }
            const pluginWithoutVersionName = getPkgVersionNameByFilterVsersion(pluginName)
            const pluginIndex = pluginList.findIndex((item)=>{
              if(typeof item === 'string') return item === pluginWithoutVersionName
              if( item instanceof Array) return item?.[0] === pluginWithoutVersionName
            })
            const shouldChangeFile = !(Number(pluginIndex !== -1) ^ Number(actionType === 'uninstall'))
            if(shouldChangeFile){
              actionType === 'install' ? pluginList.push(pluginWithoutVersionName) : pluginList.splice(pluginIndex, 1)
              const newFile = `{ "plugins" : ${JSON.stringify(pluginList)} }`
              try {
                fs.writeFileSync(configFilePath, newFile)
              } catch (e) {
                spinner.fail(`修改配置文件失败：${e}`)
              }
            }
            spinner.succeed('修改配置文件成功')
          },
          failCallback (data) {
            spinner.stop()
            spinner.warn(data.replace(/\n$/, ''))
          }
        })
      }
      switch (action) {
        case 'add-plugin':
          makeSureConfigExists()
          if (!pluginName)  return console.log('缺少要添加的插件')
          addOrRemovePlugin('install')
          break
        case 'remove-plugin' :
          makeSureConfigExists()
          if (!pluginName)  return console.error('缺少要删除的插件')
          addOrRemovePlugin('uninstall')
          break
        case 'reset':
          if(fs.existsSync(globalPluginConfigDir)) fs.removeSync(globalPluginConfigDir)
          fs.copySync(templatePath, globalPluginConfigDir)
          break
        default:
          console.error('请输出正确的参数')
      }
    }
  })
}

function getPkgVersionNameByFilterVsersion (pkgString: string) {
  const versionFlagIndex = pkgString.lastIndexOf('@')
  return versionFlagIndex === 0 ? pkgString : pkgString.slice(0, versionFlagIndex)
}