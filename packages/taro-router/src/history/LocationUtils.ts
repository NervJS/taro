import resolvePathname from 'resolve-pathname'
import valueEqual from 'value-equal'
import { parsePath } from './PathUtils'
import { Location } from '../utils/types'

function createLocation(path: string, key?: string, currentLocation?: Location): Location
function createLocation(location: Location): Location
function createLocation (pathOrLocation: string | Location, key?: string, currentLocation?: Location): Location {
  let location: Partial<Location>
  if (typeof pathOrLocation === 'string') {
    // Two-arg form: push(path, state)
    const tmpLocation = parsePath(pathOrLocation)
    location = Object.assign({}, tmpLocation)
  } else {
    // One-arg form: push(location)
    location = { ...pathOrLocation }

    if (location.pathname === undefined) location.pathname = ''

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search
    } else {
      location.search = ''
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash
    } else {
      location.hash = ''
    }
  }

  try {
    location.pathname = decodeURI(location.pathname!)
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.')
    } else {
      throw e
    }
  }

  if (key) location.state = { key }

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
    if (!location.pathname) {
      location.pathname = currentLocation.pathname
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname)
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/'
    }
  }

  return location as Location
}

const locationsAreEqual = (a, b) => a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && valueEqual(a.state, b.state)

export { createLocation, locationsAreEqual }
