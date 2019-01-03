import * as Joi from 'joi'
import * as _ from 'lodash/fp'
import * as path from 'path'
import joi2desc from './joi2desc'
import configSchema from './configSchema'

import { PROJECT_CONFIG } from '../util/constants'

const PROJECT_CONF_PATH = path.join(process.cwd(), PROJECT_CONFIG)
const PROJECT_CONF = require(PROJECT_CONF_PATH)(_.merge)

function buildDesc (error) {
  return error.path.join('.') + ' ' + joi2desc(error)
}

function buildLine (error) {
  return {
    desc: buildDesc(error),
    valid: false
  }
}

function buildReport (errors) {
  const errorLines = _.compose(_.map(buildLine), _.get('details'))(errors)
  return {
    desc: `检查 Taro 配置 (${PROJECT_CONF_PATH})`,
    lines: errorLines
  }
}

export default async function () {
  const { error } = Joi.validate(PROJECT_CONF, configSchema, { abortEarly: false })
  return buildReport(error)
}
