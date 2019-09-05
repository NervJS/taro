import * as path from 'path'
import * as fs from 'fs'
import { isEmptyObject } from '.'

let quickappConfig = {}

export function getQuickappConfig (appPath) {
  if (!isEmptyObject(quickappConfig)) {
    return quickappConfig
  }
  const configPath = path.join(appPath, 'project.quickapp.json')
  if (!fs.existsSync(configPath)) {
    quickappConfig = require('../config/manifest.default.json')
  } else {
    quickappConfig = JSON.parse(fs.readFileSync(configPath).toString())
  }
  return quickappConfig
}
