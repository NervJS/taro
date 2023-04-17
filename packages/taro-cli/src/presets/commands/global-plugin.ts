import { exec } from 'child_process'
import * as path from 'path'

import { getRootPath } from '../../util'

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
    async fn ({ _ }) {
      const [, action, pluginName] = _
      const { getUserHomeDir, TARO_GROBAL_PLUGIN_CONFIG_DIR, fs } = ctx.helper
      const homedir = getUserHomeDir()
      console.log(action, pluginName)
      const globalPluginConfigDir = path.join(homedir, TARO_GROBAL_PLUGIN_CONFIG_DIR)
      if (!homedir) return console.log('找不到用户根目录')

      // function displayConfigPath (configPath) {
      //   console.log(`Config path: ${configPath}`)
      //   console.log()
      // }
      const rootPath =getRootPath()
      console.log('rootPath', rootPath)
      switch (action) {
        case 'add':
          if(!fs.existsSync(globalPluginConfigDir)){
            console.log('目录不存在，初始化')
            await fs.mkdir(globalPluginConfigDir)
            await fs.copyFile('')
          }
          {
            const child = exec(`cd ${globalPluginConfigDir} && pwd`)
            child.stdout!.on('data', function (data) {
            // spinner.stop()
              console.log(data.replace(/\n$/, ''))
            })
          }
      }
      // switch (cmd) {
      //   case 'get':
      //     if (!key) return console.log('Usage: taro config get <key>')
      //     if (fs.existsSync(configPath)) {
      //       displayConfigPath(configPath)
      //       const config = fs.readJSONSync(configPath)
      //       console.log(`key: ${key}, value: ${config[key]}`)
      //     }
      //     break
      //   case 'set':
      //     if (!key || !value) return console.log('Usage: taro config set <key> <value>')

      //     if (fs.existsSync(configPath)) {
      //       displayConfigPath(configPath)
      //       const config = fs.readJSONSync(configPath)
      //       config[key] = value
      //       fs.writeJSONSync(configPath, config)
      //     } else {
      //       fs.ensureFileSync(configPath)
      //       fs.writeJSONSync(configPath, {
      //         [key]: value
      //       })
      //     }
      //     console.log(`set key: ${key}, value: ${value}`)
      //     break
      //   case 'delete':
      //     if (!key) return console.log('Usage: taro config delete <key>')

      //     if (fs.existsSync(configPath)) {
      //       displayConfigPath(configPath)
      //       const config = fs.readJSONSync(configPath)
      //       delete config[key]
      //       fs.writeJSONSync(configPath, config)
      //     }
      //     console.log(`deleted: ${key}`)
      //     break
      //   case 'list':
      //   case 'ls':
      //     if (fs.existsSync(configPath)) {
      //       displayConfigPath(configPath)
      //       console.log('Config info:')
      //       const config = fs.readJSONSync(configPath)
      //       if (json) {
      //         console.log(JSON.stringify(config, null, 2))
      //       } else {
      //         for (const key in config) {
      //           console.log(`${key}=${config[key]}`)
      //         }
      //       }
      //     }
      //     break
      //   default:
      //     break
      // }
    }
  })
}
