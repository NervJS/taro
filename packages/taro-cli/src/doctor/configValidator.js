const configSchema = require('./configSchema')
const Joi = require('joi')
const _ = require('lodash/fp')
const path = require('path')
const joi2desc = require('./joi2desc')

const { PROJECT_CONFIG } = require('../util')
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

module.exports = async function () {
  const { error } = Joi.validate(PROJECT_CONF, configSchema, { abortEarly: false })
  return buildReport(error)
}
