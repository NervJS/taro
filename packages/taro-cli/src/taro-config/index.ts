import * as fs from 'fs-extra'
import * as path from 'path'
import { getUserHomeDir } from '../util'

const homedir = getUserHomeDir()
const configPath = path.join(homedir, '.taro/index.json')

export function get (key: string) {
  if (!homedir) return console.log('找不到用户根目录')
  if (fs.existsSync(configPath)) {
    const config = fs.readJSONSync(configPath)
    console.log(config[key])
  }
}

export function set (key: string, value: string) {
  if (!homedir) return console.log('找不到用户根目录')

  if (fs.existsSync(configPath)) {
    const config = fs.readJSONSync(configPath)
    config[key] = value
    fs.writeJSONSync(configPath, config)
  } else {
    fs.ensureFileSync(configPath)
    fs.writeJSONSync(configPath, {
      [key]: value
    })
  }
}

export function deleteKey (key: string) {
  if (!homedir) return console.log('找不到用户根目录')

  if (fs.existsSync(configPath)) {
    const config = fs.readJSONSync(configPath)
    delete config[key]
    fs.writeJSONSync(configPath, config)
  }
}

export function list (isJSONFormat: boolean = false) {
  if (!homedir) return console.log('找不到用户根目录')
  if (fs.existsSync(configPath)) {
    const config = fs.readJSONSync(configPath)
    if (isJSONFormat) {
      console.log(JSON.stringify(config, null, 2))
    } else {
      for (const key in config) {
        console.log(`${key}=${config[key]}`)
      }
    }
  }
}
