import * as chalk from 'chalk'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'

import createBabelRegister, { injectDefineConfigHeader } from './babelRegister'
import * as constants from './constants'
import * as npm from './npm'
import createSwcRegister from './swcRegister'
import * as utils from './utils'

export const helper = {
  ...constants,
  ...utils,
  npm,
  createBabelRegister,
  injectDefineConfigHeader,
  createSwcRegister,
  fs,
  chalk,
  chokidar,
  createDebug: id => require('debug')(id)
}

export default helper
