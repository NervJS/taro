const path = require('path')
const crypto = require('crypto')
const os = require('os')
const fs = require('fs-extra')
const execSync = require('child_process').execSync
const chalk = require('chalk')

const pocessTypeEnum = {
  COMPILE: 'compile',
  COPY: 'copy',
  GENERATE: 'generate',
  MODIFY: 'modify',
  ERROR: 'error'
}

const processTypeMap = {
  [pocessTypeEnum.COMPILE]: {
    name: '编译',
    color: 'green'
  },
  [pocessTypeEnum.COPY]: {
    name: '拷贝',
    color: 'magenta'
  },
  [pocessTypeEnum.GENERATE]: {
    name: '生成',
    color: 'blue'
  },
  [pocessTypeEnum.MODIFY]: {
    name: '拷贝',
    color: 'yellow'
  },
  [pocessTypeEnum.ERROR]: {
    name: '错误',
    color: 'red'
  }
}

exports.pocessTypeEnum = pocessTypeEnum

exports.CSS_EXT = ['.css', '.scss']
exports.SCSS_EXT = ['.scss']
exports.JS_EXT = ['.js']
exports.REG_SCRIPT = /\.js(\?.*)?$/
exports.REG_STYLE = /\.(css|scss)(\?.*)?$/
exports.REG_MEDIA = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
exports.REG_IMAGE = /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/
exports.REG_FONT = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
exports.REG_JSON = /\.json(\?.*)?$/

exports.BUILD_TYPES = {
  WEAPP: 'weapp',
  H5: 'h5',
  RN: 'rn'
}

exports.PROJECT_CONFIG = 'project.config.js'

exports.DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}

exports.FILE_PROCESSOR_MAP = {
  '.js': 'babel',
  '.scss': 'sass'
}

exports.isNpmPkg = function (name) {
  if (/^(\.|\/)/.test(name)) {
    return false
  }
  return true
}

exports.promoteRelativePath = function (fPath) {
  const fPathArr = fPath.split('/')
  let dotCount = 0
  fPathArr.forEach(item => {
    if (item.indexOf('..') >= 0) {
      dotCount++
    }
  })
  if (dotCount === 1) {
    fPathArr.splice(0, 1, '.')
    return fPathArr.join('/')
  }
  if (dotCount > 1) {
    fPathArr.splice(0, 1)
    return fPathArr.join('/')
  }
  return fPath
}

exports.replaceAsync = async function (str, regex, asyncFn) {
  const promises = []
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args)
    promises.push(promise)
  })
  const data = await Promise.all(promises)
  return str.replace(regex, () => data.shift())
}

exports.homedir = (function () {
  let homedir = null
  const env = process.env
  const home = env.HOME
  const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME
  if (process.platform === 'win32') {
    homedir = env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null
  } else if (process.platform === 'darwin') {
    homedir = home || (user ? `/Users/${user}` : null)
  } else if (process.platform === 'linux') {
    homedir = home || (process.getuid() === 0 ? '/root' : (user ? `/home/${user}` : null))
  }
  return typeof os.homedir === 'function' ? os.homedir : function () {
    return homedir
  }
})()

exports.getRootPath = function () {
  return path.resolve(__dirname, '../../')
}

exports.getTaroPath = function () {
  const taroPath = path.join(exports.homedir(), '.taro')
  if (!fs.existsSync(taroPath)) {
    fs.mkdirSync(taroPath)
  }
  return taroPath
}

exports.setConfig = function (config) {
  const taroPath = exports.getTaroPath()
  if (typeof config === 'object') {
    const oldConfig = exports.getConfig()
    config = Object.assign({}, oldConfig, config)
    fs.writeFileSync(path.join(taroPath, 'config.json'), JSON.stringify(config, null, 2))
  }
}

exports.getConfig = function () {
  const configPath = path.join(exports.getTaroPath(), 'config.json')
  if (fs.existsSync(configPath)) {
    return require(configPath)
  }
  return {}
}

exports.getSystemUsername = function () {
  const userHome = exports.homedir()
  const systemUsername = process.env.USER || path.basename(userHome)
  return systemUsername
}

exports.getPkgVersion = function () {
  return require(path.join(exports.getRootPath(), 'package.json')).version
}

exports.printPkgVersion = function () {
  const taroVersion = exports.getPkgVersion()
  console.log(`👽 Taro v${taroVersion}`)
  console.log()
}

exports.shouldUseYarn = function () {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

exports.shouldUseCnpm = function () {
  try {
    execSync('cnpm --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function _normalizeFamily (family) {
  return family ? family.toLowerCase() : 'ipv4'
}

exports.getLocalIp = function (name, family) {
  const interfaces = os.networkInterfaces()
  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family)

  //
  // If a specific network interface has been named,
  // return the address.
  //
  if (name && name !== 'private' && name !== 'public') {
    const res = interfaces[name].filter(details => {
      const itemFamily = details.family.toLowerCase()
      return itemFamily === family
    })
    if (res.length === 0) {
      return undefined
    }
    return res[0].address
  }

  const all = Object.keys(interfaces).map(nic => {
    //
    // Note: name will only be `public` or `private`
    // when this is called.
    //
    const addresses = interfaces[nic].filter(details => {
      details.family = details.family.toLowerCase()
      if (details.family !== family || exports.isLoopback(details.address)) {
        return false
      } else if (!name) {
        return true
      }

      return name === 'public' ? !exports.isPrivate(details.address)
        : exports.isPrivate(details.address)
    })
    return addresses.length ? addresses[0].address : undefined
  }).filter(Boolean)

  return !all.length ? exports.loopback(family) : all[0]
}

exports.loopback = function loopback (family) {
  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family)

  if (family !== 'ipv4' && family !== 'ipv6') {
    throw new Error('family must be ipv4 or ipv6')
  }

  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1'
}

exports.isLoopback = function isLoopback (addr) {
  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
    .test(addr) ||
    /^fe80::1$/.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
}

exports.isPrivate = function isPrivate (addr) {
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

exports.isPublic = function isPublic (addr) {
  return !exports.isPrivate(addr)
}

exports.zeroPad = function (num, places) {
  const zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

exports.formatTime = function (date) {
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
  return `${year}-${exports.zeroPad(month, 2)}-${exports.zeroPad(day, 2)} ${exports.zeroPad(hour, 2)}:${exports.zeroPad(minute, 2)}`
}

exports.isEmptyObject = function (obj) {
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

exports.urlJoin = function () {
  function normalize (str) {
    return str
      .replace(/([/]+)/g, '/')
      .replace(/\/\?(?!\?)/g, '?')
      .replace(/\/#/g, '#')
      .replace(/:\//g, '://')
  }

  const joined = [].slice.call(arguments, 0).join('/')
  return normalize(joined)
}

exports.resolveScriptPath = function (p) {
  let realPath = p
  exports.JS_EXT.forEach(item => {
    if (fs.existsSync(`${p}${item}`)) {
      realPath = `${p}${item}`
    } else if (fs.existsSync(`${p}${path.sep}index${item}`)) {
      realPath = `${p}${path.sep}index${item}`
    }
  })
  return realPath
}

exports.isDifferentArray = function (a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return true
  }
  if (a.length !== b.length) {
    return true
  }
  a = a.sort()
  b = b.sort()
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return true
    }
  }
  return false
}

exports.checksum = function (buf, length) {
  if (!Buffer.isBuffer(buf)) {
    buf = Buffer.from(buf)
  }
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, length || 8)
}

exports.printLog = function (type, tag, filePath) {
  const typeShow = processTypeMap[type]
  const tagLen = tag.replace(/[\u0391-\uFFE5]/g, 'aa').length
  const tagFormatLen = 8
  if (tagLen < tagFormatLen) {
    const rightPadding = new Array(tagFormatLen - tagLen + 1).join(' ')
    tag += rightPadding
  }
  const padding = ''
  filePath = filePath || ''
  console.log(chalk[typeShow.color](typeShow.name), padding, tag, padding, filePath)
}
