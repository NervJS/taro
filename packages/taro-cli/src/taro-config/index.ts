import * as fs from 'fs-extra'
import * as path from 'path'
import { getUserHomeDir } from '../util'
import { TARO_CONFIG_FLODER, TARO_BASE_CONFIG } from '../util/constants'

const homedir = getUserHomeDir()
const configPath = path.join(homedir, `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

function displayConfigPath (configPath) {
  console.log('Config path:', configPath)
  console.log()
}

export function get (key: string) {
  if (!homedir) return console.log('找不到用户根目录')

  if (fs.existsSync(configPath)) {
    displayConfigPath(configPath)
    const config = fs.readJSONSync(configPath)
    console.log('Key:', key, ', value:', config[key])
  }
}

export function set (key: string, value: string) {
  if (!homedir) return console.log('找不到用户根目录')

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
  console.log('Set key:', key, ', value:', value)
}

export function deleteKey (key: string) {
  if (!homedir) return console.log('找不到用户根目录')

  if (fs.existsSync(configPath)) {
    displayConfigPath(configPath)
    const config = fs.readJSONSync(configPath)
    delete config[key]
    fs.writeJSONSync(configPath, config)
  }
  console.log('Deleted:', key)
}

export function list (isJSONFormat: boolean = false) {
  if (!homedir) return console.log('找不到用户根目录')

  if (fs.existsSync(configPath)) {
    displayConfigPath(configPath)
    console.log('Config info:')
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
