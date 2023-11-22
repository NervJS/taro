import BaseParser from './base'

export default class Parser extends BaseParser {
  parse () {
    return 'hello world'
  }

  isEnable (app?: boolean, page?: boolean) {
    if (app && page !== false) {
      return true
    } else if (page) {
      return true
    }
  }
}
