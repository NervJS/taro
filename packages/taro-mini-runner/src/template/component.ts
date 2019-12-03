export const componentConfig: {
  includes: Set<string>
  exclude: Set<string>
  thirdPartyComponents: Map<string, Set<string>>
} = {
  includes: new Set(),
  exclude: new Set(),
  thirdPartyComponents: new Map()
}
