import * as ora from 'ora'
import * as path from 'path'

import { execCommand, getRootPath } from '../../util'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'global-plugin',
    synopsisList: [
      'taro global-plugin add [pluginName]',
      'taro global-plugin remove [pluginName]',
      'taro global-plugin reset',
      'taro global-plugin install'
    ],
    optionsMap: {
      '--pkg-version [version]': 'pkg version',
      '-h, --help': 'output usage information'
    },
    fn ({ _, options }) {
      const version = options?.['pkg-version'] || ''
      const [, action, pluginName] = _
      const { getUserHomeDir, TARO_GROBAL_PLUGIN_CONFIG_DIR, fs, TARO_GLOBAL_PLUGIN_CONFIG_FILE } = ctx.helper
      const homedir = getUserHomeDir()
      const globalPluginConfigDir = path.join(homedir, TARO_GROBAL_PLUGIN_CONFIG_DIR)
      if (!homedir) return console.log('找不到用户根目录')
      const rootPath = getRootPath()
      const templatePath = path.join(rootPath, 'templates', 'global-plugin')
      switch (action) {
        case 'add':
          if(!fs.existsSync(globalPluginConfigDir)){
            console.log('目录不存在，初始化')
            fs.copySync(templatePath, globalPluginConfigDir)
          }
          if (!pluginName)  return console.log('缺少要添加的插件')
          {const spinner = ora(`开始安装插件 ${pluginName}`).start()
            execCommand({
              command: `cd ${globalPluginConfigDir} && npm install ${pluginName}@${version}`,
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
                const isPluginEeists = pluginList.findIndex((item)=>{
                  if(typeof item === 'string') return item === pluginName
                  if( item instanceof Array) return item?.[0] === pluginName
                }) !== -1
                if(!isPluginEeists){
                  pluginList.push(pluginName)
                  const newFile = `{ "plugins" : ${JSON.stringify(pluginList)} }`
                  fs.writeFileSync(configFilePath, newFile)
                }
                spinner.succeed('修改配置文件成功')
              },
              failCallback (data) {
                spinner.stop()
                spinner.warn(data.replace(/\n$/, ''))
              }
            })
            break
          }
        case 'reset':
          if(fs.existsSync(globalPluginConfigDir)) fs.removeSync(globalPluginConfigDir)
          fs.copySync(templatePath, globalPluginConfigDir)
          break
        case 'remove' :
          if(!fs.existsSync(globalPluginConfigDir)){
            console.log('目录不存在，初始化')
            fs.copySync(templatePath, globalPluginConfigDir)
          }
          if (!pluginName)  return console.log('缺少要删除的插件')
          {const spinner = ora(`开始删除插件 ${pluginName}`).start()
            execCommand({
              command: `cd ${globalPluginConfigDir} && npm uninstall ${pluginName}`,
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
                const pluginIndex = pluginList.findIndex((item)=>{
                  if(typeof item === 'string') return item === pluginName
                  if( item instanceof Array) return item?.[0] === pluginName
                }) 
                console.log(pluginIndex)
                if(pluginIndex !== -1){
                  pluginList.splice(pluginIndex, 1)
                  const newFile = `{ "plugins" : ${JSON.stringify(pluginList)} }`
                  fs.writeFileSync(configFilePath, newFile)
                }
                spinner.succeed('修改配置文件成功')
              },
              failCallback (data) {
                spinner.stop()
                spinner.warn(data.replace(/\n$/, ''))
              }
            })
            break
          }
        default:
          console.warn('请输出正确的参数')
      }
    }
  })
}
