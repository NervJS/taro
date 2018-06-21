const path = require('path')
const crypto = require('crypto')
const os = require('os')
const fs = require('fs-extra')
const execSync = require('child_process').execSync
const chalk = require('chalk')

const pocessTypeEnum = {
  CREATE: 'create',
  COMPILE: 'compile',
  COPY: 'copy',
  GENERATE: 'generate',
  MODIFY: 'modify',
  ERROR: 'error',
  WARNING: 'warning'
}

const processTypeMap = {
  [pocessTypeEnum.CREATE]: {
    name: '创建',
    color: 'cyan'
  },
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
    name: '修改',
    color: 'yellow'
  },
  [pocessTypeEnum.ERROR]: {
    name: '错误',
    color: 'red'
  },
  [pocessTypeEnum.WARNING]: {
    name: '警告',
    color: 'yellow'
  }
}

exports.pocessTypeEnum = pocessTypeEnum

exports.CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl']
exports.SCSS_EXT = ['.scss']
exports.JS_EXT = ['.js', '.jsx']
exports.TS_EXT = ['.ts', '.tsx']
exports.REG_JS = /\.js(\?.*)?$/
exports.REG_SCRIPT = /\.(js|jsx)(\?.*)?$/
exports.REG_TYPESCRIPT = /\.(tsx|ts)(\?.*)?$/
exports.REG_STYLE = /\.(css|scss|sass|less|styl)(\?.*)?$/
exports.REG_MEDIA = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
exports.REG_IMAGE = /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/
exports.REG_FONT = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
exports.REG_JSON = /\.json(\?.*)?$/

exports.BUILD_TYPES = {
  WEAPP: 'weapp',
  H5: 'h5',
  RN: 'rn'
}

exports.PROJECT_CONFIG = 'config/index.js'

exports.DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}

exports.FILE_PROCESSOR_MAP = {
  '.js': 'babel',
  '.scss': 'sass',
  '.sass': 'sass',
  '.less': 'less',
  '.styl': 'stylus'
}

exports.isNpmPkg = function (name) {
  if (/^(\.|\/)/.test(name)) {
    return false
  }
  return true
}

exports.promoteRelativePath = function (fPath) {
  const fPathArr = fPath.split(path.sep)
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
  return fPath.replace(/\\/g, '/')
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

exports.getPkgItemByKey = function (key) {
  const packageMap = require(path.join(exports.getRootPath(), 'package.json'))
  if (Object.keys(packageMap).indexOf(key) === -1) {
    return {}
  } else {
    return packageMap[key]
  }
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

exports.isPublic = function isPublic (addr) {
  return !exports.isPrivate(addr)
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
  const SCRIPT_EXT = exports.JS_EXT.concat(exports.TS_EXT)
  for (let i = 0; i < SCRIPT_EXT.length; i++) {
    const item = SCRIPT_EXT[i]
    if (fs.existsSync(`${p}${item}`)) {
      return `${p}${item}`
    }
    if (fs.existsSync(`${p}${path.sep}index${item}`)) {
      return `${p}${path.sep}index${item}`
    }
  }
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

exports.replaceContentEnv = function (content, env) {
  if (env && !exports.isEmptyObject(env)) {
    for (const key in env) {
      const reg = new RegExp(`process.env.${key}`, 'g')
      content = content.replace(reg, env[key])
    }
    return content
  }
  return content
}

exports.replaceContentConstants = function (content, constants) {
  if (constants && !exports.isEmptyObject(constants)) {
    for (const key in constants) {
      const reg = new RegExp(key, 'g')
      content = content.replace(reg, constants[key])
    }
    return content
  }
  return content
}
