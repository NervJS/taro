import { prettyPrintJson } from '../../utils'

export default class BaseParser {
  prettyPrintJson = prettyPrintJson
  transArr2Str (array: unknown[], prefixSpace = 0, connector = '\n') {
    return array
      .filter(e => typeof e === 'string' || (e instanceof Array && e.length > 0))
      .reduce<string>((p, e)=> `${p ? `${p}${connector}` : ''}${' '.repeat(prefixSpace)}${
      e instanceof Array ? this.transArr2Str(e, prefixSpace, connector) : e
    }`, '')
  }
}
