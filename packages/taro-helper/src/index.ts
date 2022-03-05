import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as chokidar from 'chokidar'
import createDebug from 'debug'

import * as constants from './constants'
import * as utils from './utils'
import * as npm from './npm'
import createBabelRegister, { injectDefineConfigHeader } from './babelRegister'
import createSwcRegister from './swcRegister'

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
  createDebug
}

export default helper
