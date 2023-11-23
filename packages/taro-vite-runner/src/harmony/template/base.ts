import { prettyPrintJson } from '../../utils'

export default class BaseParser {
  prettyPrintJson = prettyPrintJson
  transArr2Str (array: unknown[], prefixSpace = 0, connector = '\n') {
    return array
      .filter(e => typeof e === 'string')
      .reduce<string>((p, e)=> `${p ? `${p}${connector}` : ''}${' '.repeat(prefixSpace)}${e}`, '')
    // .join(`${connector}${' '.repeat(prefixSpace)}`)
  }
}
