type Tagname = string
type Attrs = Set<string>

export interface IComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<Tagname, Attrs>
  includeAll: boolean
}

export interface IModifyWebpackChain {
  componentConfig?: IComponentConfig
}
