import { readFile } from 'fs'
import { createServer } from 'http'
import * as mime from 'mime-types'
import { extname, join } from 'path'
import { toString } from 'qrcode'
import { URL } from 'url'

import { getOpenHost, isWin, PLAYGROUNDINFO } from './utils'

interface PreviewOption {
  out: string
  platform: string
  assetsDest?: string
}

const drawableFileTypes = new Set<string>([
  'gif',
  'jpeg',
  'jpg',
  'png',
  'webp',
  'xml'
])

function getAndroidAssetSuffix (scale: number): string {
  switch (scale) {
    case 0.75:
      return 'ldpi'
    case 1:
      return 'mdpi'
    case 1.5:
      return 'hdpi'
    case 2:
      return 'xhdpi'
    case 3:
      return 'xxhdpi'
    case 4:
      return 'xxxhdpi'
    default:
      return ''
  }
}

function getAndroidResourceFolderName (pathname:string): string {
  const ext = extname(pathname).replace(/^./, '').toLowerCase()
  if (!drawableFileTypes.has(ext)) {
    return 'raw'
  }
  const suffix = getAndroidAssetSuffix(1) // TODO: auto scale
  const androidFolder = `drawable-${suffix}`
  return androidFolder
}

function getAndroidResourceIdentifier (pathname:string): string {
  if (pathname[0] === '/') {
    pathname = pathname.substr(1)
  }
  const ext = extname(pathname).toLowerCase()
  const extReg = new RegExp(ext + '$')
  return pathname
    .replace(extReg, '')
    .toLowerCase()
    .replace(/\//g, '_')
    .replace(/([^a-z0-9_])/g, '')
    .replace(/^assets_/, '') + ext
}

export function previewProd (opt: PreviewOption):void {
  const port = process.env.PORT || 8079
  const host = `http://${getOpenHost()}:${port}`

  createServer(function (request, response) {
    const url = new URL(request.url || '', host)

    console.log(`${request.method} ${request.url}`)

    if (url.pathname === '/inspector/device') {
      response.writeHead(404)
      response.end('404', 'utf-8')
      return
    }

    let filePath
    const contentType = mime.lookup(url.pathname)

    if (url.pathname === '/index.js') {
      filePath = opt.out
    } else if (opt.platform === 'ios') {
      filePath = join(opt.assetsDest || '', url.pathname)
    } else if (opt.platform === 'android') {
      filePath = join(opt.assetsDest || '', getAndroidResourceFolderName(url.pathname), getAndroidResourceIdentifier(url.pathname))
    }

    readFile(filePath, function (error, content) {
      if (error) {
        if (error.code === 'ENOENT') {
          response.writeHead(404)
          response.end('404', 'utf-8')
        } else {
          response.writeHead(500)
          response.end('500', 'utf-8')
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType })
        response.end(content, 'utf-8')
      }
    })
  }).listen(port)

  const url = `${host}/index.js`
  console.log(PLAYGROUNDINFO)
  console.log(`print qrcode of ${opt.platform} bundle '${url}':`)
  toString(url, { type: 'terminal', small: !isWin }).then(console.log)
}

interface PreviewDevOption {
  port: number
}

export function previewDev (args:PreviewDevOption):void {
  const host = getOpenHost()
  if (host) {
    const url = `taro://${host}:${args.port}`
    console.log(PLAYGROUNDINFO)
    console.log(`print qrcode of '${url}':`)
    toString(url, { type: 'terminal', small: !isWin }).then(console.log)
  } else {
    console.log('print qrcode error: host not found.')
  }
}