import { prettyPrintJson } from '../../utils'

export default class BaseParser {
  prettyPrintJson = prettyPrintJson
  transArr2Str (array: unknown[], prefixSpace = 0) {
    return array.filter(e => typeof e === 'string').join(`\n${' '.repeat(prefixSpace)}`)
  }
}
