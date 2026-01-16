import { parseUrl } from '../bom/URL'
import { TaroElement } from './element'

const enum AnchorElementAttrs {
  HREF = 'href',
  PROTOCOL = 'protocol',
  HOST = 'host',
  SEARCH = 'search',
  HASH = 'hash',
  HOSTNAME = 'hostname',
  PORT = 'port',
  PATHNAME = 'pathname'
}

export class AnchorElement extends TaroElement {
  public get href () {
    return this.props[AnchorElementAttrs.HREF] ?? ''
  }

  public set href (val: string) {
    this.setAttribute(AnchorElementAttrs.HREF, val)
  }

  get protocol () {
    return this.props[AnchorElementAttrs.PROTOCOL] ?? ''
  }

  get host () {
    return this.props[AnchorElementAttrs.HOST] ?? ''
  }

  get search () {
    return this.props[AnchorElementAttrs.SEARCH] ?? ''
  }

  get hash () {
    return this.props[AnchorElementAttrs.HASH] ?? ''
  }

  get hostname () {
    return this.props[AnchorElementAttrs.HOSTNAME] ?? ''
  }

  get port () {
    return this.props[AnchorElementAttrs.PORT] ?? ''
  }

  get pathname () {
    return this.props[AnchorElementAttrs.PATHNAME] ?? ''
  }

  public setAttribute (qualifiedName: string, value: any): void {
    if (qualifiedName === AnchorElementAttrs.HREF) {
      const willSetAttr = parseUrl(value)
      for (const k in willSetAttr) {
        super.setAttribute(k, willSetAttr[k])
      }
    } else {
      super.setAttribute(qualifiedName, value)
    }
  }
}
