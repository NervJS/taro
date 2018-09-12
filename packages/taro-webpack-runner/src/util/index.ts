import * as os from 'os'
import * as path from 'path'
import * as url from 'url'

const isEmptyObject = function (obj) {
  if (obj == null) {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

const getRootPath = function () {
  return path.resolve(__dirname, '../../')
}

const zeroPad = function (num, places) {
  const zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

const formatTime = function (date?) {
  if (!date) {
    date = new Date()
  } else if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${zeroPad(month, 2)}-${zeroPad(day, 2)} ${zeroPad(hour, 2)}:${zeroPad(minute, 2)}`
}

function _normalizeFamily (family) {
  return family ? family.toLowerCase() : 'ipv4'
}

const getLocalIp = function (name?, family?) {
  const interfaces = os.networkInterfaces();
  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family);

  //
  // If a specific network interface has been named,
  // return the address.
  //
  if (name && name !== 'private' && name !== 'public') {
    const res = interfaces[name].filter(details => {
      const itemFamily = details.family.toLowerCase();
      return itemFamily === family;
    });
    if (res.length === 0) {
      return undefined;
    }
    return res[0].address;
  }

  const all = Object.keys(interfaces)
    .map(nic => {
      //
      // Note: name will only be `public` or `private`
      // when this is called.
      //
      const local = interfaces[nic].find(details => {
        const detailsFamily = details.family.toLowerCase();
        if (detailsFamily !== family || isLoopback(details.address)) {
          return false;
        } else if (!name) {
          return true;
        }

        return name === 'public'
          ? !isPrivate(details.address)
          : isPrivate(details.address);
      });
      return local ? local.address : undefined;
    })
    .filter(Boolean);

  return !all.length ? loopback(family) : all[0];
}

const isPrivate = function (addr) {
  return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/
    .test(addr) ||
    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/.test(addr) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/
      .test(addr) ||
    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(addr) ||
    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/.test(addr) ||
    /^fc00:/i.test(addr) ||
    /^fe80:/i.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
}

const loopback = function(family) {
  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family);

  if (family !== 'ipv4' && family !== 'ipv6') {
    throw new Error('family must be ipv4 or ipv6');
  }

  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1';
};

const isLoopback = function (addr) {
  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
    .test(addr) ||
    /^fe80::1$/.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
}

const prepareUrls = function (protocol, host, port) {
  const formatUrl = hostname =>
    url.format({
      protocol,
      hostname,
      port,
      pathname: '/'
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  let prettyHost, lanUrlForConfig, lanUrlForTerminal
  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      lanUrlForConfig = getLocalIp()
      if (lanUrlForConfig) {
        if (isPrivate(lanUrlForConfig)) {
          lanUrlForTerminal = formatUrl(lanUrlForConfig)
        } else {
          lanUrlForConfig = undefined
        }
      }
    } catch (err) { }
  } else {
    prettyHost = host
  }
  const localUrlForTerminal = formatUrl(prettyHost)
  const localUrlForBrowser = formatUrl(prettyHost)
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser
  }
}

export {
  isEmptyObject,
  getRootPath,
  zeroPad,
  formatTime,
  getLocalIp,
  isPrivate,
  isLoopback,
  prepareUrls
}
