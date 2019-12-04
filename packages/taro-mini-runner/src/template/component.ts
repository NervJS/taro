type Tagname = string
type Attrs = Set<string>

export const componentConfig: {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<Tagname, Attrs>
} = {
  includes: new Set(),
  exclude: new Set(),
  thirdPartyComponents: new Map()
}
