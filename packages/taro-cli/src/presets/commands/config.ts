/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { IPluginContext } from '@tarojs/service'
import * as path from 'path'

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
