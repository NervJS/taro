import * as fs from 'fs-extra'
import * as chalk from 'chalk'

import * as constants from './constants'
import * as utils from './utils'
import * as npm from './npm'

export const helper = {
  ...constants,
  ...utils,
  npm,
  fs,
  chalk
}

export default helper
