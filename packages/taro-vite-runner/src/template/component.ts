type Tagname = string
type Attrs = Set<string>

export interface IComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<Tagname, Attrs>
  includeAll: boolean
}

const initialComps = ['view', 'catch-view', 'static-view', 'pure-view', 'scroll-view', 'image', 'static-image', 'text', 'static-text']

export const componentConfig: IComponentConfig = {
  includes: new Set(initialComps),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: false
}
