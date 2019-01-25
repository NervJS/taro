import resolvePathname from 'resolve-pathname'
import valueEqual from 'value-equal'
import assign from 'lodash/assign'

import { parsePath } from './PathUtils'
import { Location } from '../utils/types'

function createLocation (path: string, key: string, currentLocation?: Location): Location {
  let location: Partial<Location>
  const tmpLocation = parsePath(path)
  location = assign({}, tmpLocation, {
    state: { key }
  })
  location.state = { key }

  const params = {}
  const searchString = location.search!
  if (searchString.length > 0) {
    const queryString = searchString.substring(1)
    queryString.split('&').forEach(pair => {
      if (pair.indexOf('=') === -1) return;
      const [ key, value ] = pair.split('=')
      params[key] = value
    })
  }
  location.params = params

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.path) {
      location.path = currentLocation.path
    } else if (location.path.charAt(0) !== '/') {
      location.path = resolvePathname(location.path, currentLocation.path)
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.path) {
      location.path = '/'
    }
  }

  return location as Location
}

const locationsAreEqual = (a, b) => a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && valueEqual(a.state, b.state)

export { createLocation, locationsAreEqual }
