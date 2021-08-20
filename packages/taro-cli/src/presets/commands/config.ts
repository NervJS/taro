/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as path from 'path'
import { IPluginContext } from '@tarojs/service'

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
      const { fs, getUserHomeDir, TARO_CONFIG_FLODER, TARO_BASE_CONFIG } = ctx.helper
      const homedir = getUserHomeDir()
      const configPath = path.join(homedir, `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)
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
