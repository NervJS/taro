import path from 'node:path'
import vm from 'node:vm'

import { fs } from '@tarojs/helper'
import JSON5 from 'json5'

export function readJsonSync (file: string) {
  const ext = path.extname(file)
  if (ext === '.json5') {
    const raw = fs.readFileSync(file, 'utf-8')
    return JSON5.parse(raw)
  }
  return fs.readJSONSync(file)
}

export async function generateV8Cache (filename: string, code?: string) {
  if (!code) {
    code = fs.readFileSync(filename, 'utf-8')
  }
  const script = new vm.Script(code, {
    filename,
  })
  const buffer = script.createCachedData()
  // const firstLine = code.split('\n')[0]
  // const jsonStr = firstLine.slice(firstLine.indexOf('{'), firstLine.lastIndexOf('}') + 1)
  // const timestampBuffer = Buffer.alloc(8)
  // timestampBuffer.writeBigInt64BE(BigInt(JSON.parse(jsonStr).timeStamp))
  // fs.writeFileSync(`${filename}.v8c`, Buffer.concat([timestampBuffer, buffer]))
  // fs.writeFileSync(`${filename}.v8c`, buffer, 'utf-8')
  console.log(`generate v8 cache for ${filename} v8_version: ${process.versions.v8}`, buffer.length) // eslint-disable-line no-console
  // if (!filename.includes('@tarojs/taro')) {
  //   createV8CachedData(filename)
  // }

  // console.log(`CachedData ${filename}:`, analyzeCacheMetadata(fs.readFileSync(`${filename}.v8c`))) // eslint-disable-line no-console
}

export function analyzeCacheMetadata(buffer: Buffer) {
  // 解析头部信息
  return {
    magic: buffer.readUInt32LE(0).toString(16), // 魔数
    version: buffer.readUInt32LE(4).toString(16), // V8 版本哈希
    sourceHash: buffer.readUInt32LE(8).toString(16), // 源代码哈希
    cpuFeatures: buffer.readUInt32LE(12).toString(16), // CPU 特性标志
    flags: buffer.readUInt32LE(16).toString(16), // 编译标志
    length: buffer.readUInt32LE(20), // 缓存数据长度
    timestamp: buffer.readBigInt64LE(24), // 时间戳
    hash: buffer.readUInt32LE(32).toString(16), // 缓存数据哈希
  }
}
