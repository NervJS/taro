export let routesAlias = {}

export function setRoutesAlias (alias) {
  routesAlias = alias
}

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}
