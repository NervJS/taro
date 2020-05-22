import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as chokidar from 'chokidar'
import createDebug from 'debug'

import * as constants from './constants'
import * as utils from './utils'
import * as npm from './npm'
import createBabelRegister from './babelRegister'

export const helper = {
  ...constants,
  ...utils,
  npm,
  createBabelRegister,
  fs,
  chalk,
  chokidar,
  createDebug
}

export default helper
