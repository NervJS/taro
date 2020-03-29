import * as fs from 'fs-extra'
import * as chalk from 'chalk'

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
  chalk
}

export default helper
