import * as _ from 'lodash/fp'
import joi2desc from './joi2desc'
import configSchema from './configSchema'

function buildDesc (error) {
  return error.path.join('.') + ' ' + joi2desc(error)
}

function buildLine (error) {
  return {
    desc: buildDesc(error),
    valid: false
  }
}

function buildReport (configPath, errors) {
  const errorLines = _.compose(
    _.map(buildLine),
    _.get('details')
  )(errors)
  return {
    desc: `检查 Taro 配置 (${configPath})，请到文档查看详情：https://nervjs.github.io/taro/docs/next/config-detail。`,
    lines: errorLines
  }
}

export default async function ({ configPath, projectConfig }) {
  const { error } = configSchema.validate(projectConfig, { abortEarly: false })
  return buildReport(configPath, error)
}
