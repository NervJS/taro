import { ContainerModule } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { setInnerHTML } from './inner-html/html'
import { getBoundingClientRectImpl } from './element'
import { insertAdjacentHTMLImpl } from './node'

// webpack define plugin
declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_SIZE_APIS: boolean

const domExternal = new ContainerModule(bind => {
  if (process.env.TARO_ENV !== 'h5') {
    if (typeof ENABLE_INNER_HTML !== 'undefined' && ENABLE_INNER_HTML) {
      bind(SERVICE_IDENTIFIER.InnerHTMLImpl).toFunction(setInnerHTML)
      if (typeof ENABLE_ADJACENT_HTML !== 'undefined' && ENABLE_ADJACENT_HTML) {
        bind(SERVICE_IDENTIFIER.insertAdjacentHTMLImpl).toFunction(insertAdjacentHTMLImpl)
      }
    }
    if (typeof ENABLE_SIZE_APIS !== 'undefined' && ENABLE_SIZE_APIS) {
      bind(SERVICE_IDENTIFIER.getBoundingClientRectImpl).toFunction(getBoundingClientRectImpl)
    }
  }
})

export default domExternal
