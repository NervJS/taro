import * as mime from 'mime-types'
import { createServer } from 'http'
import { readFile } from 'fs'
import { generate } from 'qrcode-terminal'
import { getOpenHost } from '../utils'
import { URL } from 'url'
import path from 'path'

interface PreviewOption {
  out: string
  platform: string
  assetsDest?: string
}

export default (opt: PreviewOption) => {
  const port = process.env.PORT || 8079
  const host = `http://${getOpenHost()}:${port}`

  createServer(function (request, response) {
    const url = new URL(request.url || '', host)

    console.log(`${request.method} ${request.url}`)

    if (url.searchParams.get('platform') !== opt.platform) {
      response.writeHead(400)
      response.end('400', 'utf-8')
      return
    }

    let filePath
    const contentType = mime.lookup(url.pathname)

    if (url.pathname === '/index.js') {
      filePath = opt.out
    } else if (opt.platform === 'ios') {
      filePath = path.join(opt.assetsDest || '', url.pathname)
    } else if (opt.platform === 'android') {
      filePath = path.join(opt.assetsDest || '', 'drawable-mdpi', url.pathname.replace(new RegExp(path.sep, 'g'), '_'))
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
  console.log(`print qrcode of '${url}':`)
  generate(url, { small: true })
}
