import * as ora from 'ora'
import * as path from 'path'
import * as validatePkgName from 'validate-npm-package-name'

import { execCommand, getPkgNameByFilterVersion, getRootPath } from '../../util'

import type { IPluginContext } from '@tarojs/service'

type TPresetOrPluginAction = 'install' | 'uninstall'
type TPluginType = 'plugin' | 'preset'

const PRESET_OR_PLUGIN_COMMAND_CHINESE_MAP_MAP = {
  install: '添加',
  uninstall: '删除'
}
const PRESET_OR_PLUGIN_CHINESE_NAME_MAP = {
  plugin: '插件',
  preset: '插件集'
}

const PLUGIN_TYPE_TO_CONFIG_KEY = {
  plugin: 'plugins',
  preset: 'presets'
}



export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'global-config',
    synopsisList: [
      'taro global-config add-plugin [pluginName]',
      'taro global-config remove-plugin [pluginName]',
      'taro global-config add-preset [presetName]',
      'taro global-config remove-preset [presetName]',
      'taro global-config reset',
    ],
    optionsMap: {
      '-h, --help': 'output usage information'
    },
    fn ({ _ }) {
      const [, action, pluginName] = _
      const { getUserHomeDir, TARO_GLOBAL_CONFIG_DIR, fs, TARO_GLOBAL_CONFIG_FILE } = ctx.helper
      const homedir = getUserHomeDir()
      const globalPluginConfigDir = path.join(homedir, TARO_GLOBAL_CONFIG_DIR)
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
      function addOrRemovePresetOrPlugin (actionType: TPresetOrPluginAction, pluginType: TPluginType ) {
        makeSureConfigExists()
        const presetOrPluginChineseName = PRESET_OR_PLUGIN_CHINESE_NAME_MAP[pluginType]
        const chineseCommand = PRESET_OR_PLUGIN_COMMAND_CHINESE_MAP_MAP[actionType]
        if (!pluginName) {
          console.error(`缺少要${chineseCommand}的${presetOrPluginChineseName}`)
          process.exit(1)
        }

        const spinner = ora(`开始${chineseCommand}${presetOrPluginChineseName} ${pluginName}`).start()
        const pluginWithoutVersionName = getPkgNameByFilterVersion(pluginName)
        if(!validatePkgName(pluginWithoutVersionName).validForNewPackages) {
          spinner.fail('安装的插件名不合规！')
          process.exit(1)
        }
        execCommand({
          command: `cd ${globalPluginConfigDir} && npm ${actionType} ${pluginName}`,
          successCallback (data) {
            console.log(data.replace(/\n$/, ''))
            spinner.start(`开始修改${presetOrPluginChineseName}配置`)
            const configFilePath = path.join(globalPluginConfigDir, TARO_GLOBAL_CONFIG_FILE)
            let globalConfig
            try {
              globalConfig = fs.readJSONSync(configFilePath)
            } catch (e){
              spinner.fail('获取配置文件失败')
            }
            const configKey = PLUGIN_TYPE_TO_CONFIG_KEY[pluginType]
            const configItem = globalConfig[configKey] || []
            const pluginIndex = configItem.findIndex((item)=>{
              if(typeof item === 'string') return item === pluginWithoutVersionName
              if( item instanceof Array) return item?.[0] === pluginWithoutVersionName
            })
            const shouldChangeFile = !(Number(pluginIndex !== -1) ^ Number(actionType === 'uninstall'))
            if(shouldChangeFile){
              actionType === 'install' ? configItem.push(pluginWithoutVersionName) : configItem.splice(pluginIndex, 1)
              try {
                fs.writeJSONSync(configFilePath, {
                  [configKey] : configItem
                })
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
          addOrRemovePresetOrPlugin('install', 'plugin')
          break
        case 'remove-plugin' :
          addOrRemovePresetOrPlugin('uninstall', 'plugin')
          break
        case 'add-preset':
          addOrRemovePresetOrPlugin('install', 'preset')
          break
        case 'remove-preset' :
          addOrRemovePresetOrPlugin('uninstall', 'preset')
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

