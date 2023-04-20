import * as path from 'path'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'config',
    optionsMap: {
      '--json': '以 JSON 形式输出'
    },
    synopsisList: [
      'taro config set <key> <value>',
      'taro config get <key>',
      'taro config delete <key>',
      'taro config list [--json]'
    ],
    fn ({ _, options }) {
      const [, cmd, key, value] = _
      const json = !!options.json
      const { fs, getUserHomeDir, TARO_CONFIG_FOLDER, TARO_BASE_CONFIG } = ctx.helper
      const homedir = getUserHomeDir()
      const configPath = path.join(homedir, `${TARO_CONFIG_FOLDER}/${TARO_BASE_CONFIG}`)
      if (!homedir) return console.log('找不到用户根目录')

      function displayConfigPath (configPath) {
        console.log(`Config path: ${configPath}`)
        console.log()
      }

      switch (cmd) {
        case 'get':
          if (!key) return console.log('Usage: taro config get <key>')
          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            console.log(`key: ${key}, value: ${config[key]}`)
          }
          break
        case 'set':
          if (!key || !value) return console.log('Usage: taro config set <key> <value>')

          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            config[key] = value
            fs.writeJSONSync(configPath, config)
          } else {
            fs.ensureFileSync(configPath)
            fs.writeJSONSync(configPath, {
              [key]: value
            })
          }
          console.log(`set key: ${key}, value: ${value}`)
          break
        case 'delete':
          if (!key) return console.log('Usage: taro config delete <key>')

          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            delete config[key]
            fs.writeJSONSync(configPath, config)
          }
          console.log(`deleted: ${key}`)
          break
        case 'list':
        case 'ls':
          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            console.log('Config info:')
            const config = fs.readJSONSync(configPath)
            if (json) {
              console.log(JSON.stringify(config, null, 2))
            } else {
              for (const key in config) {
                console.log(`${key}=${config[key]}`)
              }
            }
          }
          break
        default:
          break
      }
    }
  })
}
