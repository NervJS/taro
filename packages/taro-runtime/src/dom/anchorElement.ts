import { parseUrl } from '../bom/location'
import { TaroElement } from './element'

const enum AnchorElementAttrs  {
  HREF = 'href',
  PROTOCOL = 'protocol',
  HOST = 'host',
  SEARCH = 'search',
  HASH ='hash',
  HOSTNAME = 'hostname',
  PORT = 'port',
  PATHNAME= 'pathname'
}

export class AnchorElement extends TaroElement {
  public get href () {
    // eslint-disable-next-line dot-notation
    const href = this.props[AnchorElementAttrs.HREF]
    return href == null ? '' : href
  }

  public set href (val: string) {
    this.setAttribute(AnchorElementAttrs.HREF, val)
  }

  get protocol () {
    const v = this.props[AnchorElementAttrs.PROTOCOL]
    return v == null ? '' : v
  }

  get host () {
    const v = this.props[AnchorElementAttrs.HOST]
    return v == null ? '' : v
  }

  get search () {
    const v = this.props[AnchorElementAttrs.SEARCH]
    return v == null ? '' : v
  }

  get hash () {
    const v = this.props[AnchorElementAttrs.HASH]
    return v == null ? '' : v
  }

  get hostname () {
    const v = this.props[AnchorElementAttrs.HOSTNAME]
    return v == null ? '' : v
  }

  get port () {
    const v = this.props[AnchorElementAttrs.PORT]
    return v == null ? '' : v
  }

  get pathname () {
    const v = this.props[AnchorElementAttrs.PATHNAME]
    return v == null ? '' : v
  }

  public setAttribute (qualifiedName: string, value: any): void {
    if (qualifiedName  === AnchorElementAttrs.HREF) {
      const willSetAttr = parseUrl(value)
      for (const k in willSetAttr) {
        super.setAttribute(k, willSetAttr[k])
      }
    } else {
      super.setAttribute(qualifiedName, value)
    }
  }

}
  