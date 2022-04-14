type Tagname = string
type Attrs = Set<string>

export interface IcomponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<Tagname, Attrs>
  includeAll: boolean
}

export const componentConfig: IcomponentConfig = {
  includes: new Set(['view', 'catch-view', 'static-view', 'pure-view', 'scroll-view', 'image', 'static-image', 'text', 'static-text']),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: false
}
