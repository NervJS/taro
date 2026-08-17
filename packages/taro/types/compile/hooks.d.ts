type Tagname = string
type Attrs = Set<string>

export interface IComponentConfig {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<Tagname, Attrs>
  includeAll: boolean
  scopedIncludes: Map<string, Set<string>>
}

export interface IModifyChainData {
  componentConfig?: IComponentConfig
}
