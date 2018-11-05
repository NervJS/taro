/**
 * Created by Wu Jian Ping on 2018/11/1.
 */

const fs = require('fs')
const mkdirp  = require('mkdirp')
const xxhashjs = require('xxhashjs')
const path = require('path')
const mime = require('mime')

const REG_IMAGE = /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/
const REG_URL = /((http|ftp|https):\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/
const REG_MEDIA = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const REG_FONT = /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/

const copyFile = (source, target) =>  {
  fs.copyFileSync(source, target)
}

const createDirIfNotExists = dir => {
  mkdirp.sync(dir)
}

const getFileNameWithHash = fileName => {
  let buf = fs.readFileSync(fileName)
  let digest = xxhashjs.h32(0).update(buf).digest()
  let extName = path.extname(fileName)
  let fileNameWithoutExt = path.basename(fileName, extName)
  return `${fileNameWithoutExt}_${digest}${extName}`
}

const getAppPath = () => process.cwd()

const isImage = val => REG_IMAGE.test(val)

const isUrl = val => REG_URL.test(val)

const isMedia = val => REG_MEDIA.test(val)

const isFont = val => REG_FONT.test(val)

const getFile = filePath => {
  return {
    path: filePath,
    contents: fs.readFileSync(filePath),
    mimeType: mime.getType(filePath)
  };
}

const optimizedSvgEncode = (svgContent) => {
  const result = encodeURIComponent(svgContent)
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%22/g, "'")
    .replace(/%2C/g, ',')
    .replace(/%3B/g, ';')

  // Lowercase the hex-escapes for better gzipping
  return result.replace(/(%[0-9A-Z]{2})/g, (matched, AZ) => {
    return AZ.toLowerCase()
  })
}

const encodeFile = (file, encodeType, shouldOptimizeSvgEncode) => {
  const dataMime = `data:${file.mimeType}`

  if (encodeType === 'base64') {
    return `${dataMime};base64,${file.contents.toString('base64')}`
  }

  const encodeFunc = encodeType === 'encodeURI' ? encodeURI : encodeURIComponent

  const content = file.contents.toString('utf8')
  // removing new lines
    .replace(/\n+/g, '')

  let encodedStr = (shouldOptimizeSvgEncode && encodeType === 'encodeURIComponent')
    ? optimizedSvgEncode(content)
    : encodeFunc(content)

  encodedStr = encodedStr
    .replace(/%20/g, ' ')
    .replace(/#/g, '%23')

  return `${dataMime},${encodedStr}`
};

module.exports = {
  copyFile,
  createDirIfNotExists,
  getFileNameWithHash,
  getAppPath,
  isImage,
  isUrl,
  isMedia,
  isFont,
  getFile,
  encodeFile
}
