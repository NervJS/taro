import * as os from 'node:os'
// import type { Config, Refs, Printer } from 'pretty-format'

export const print = (val: string) => {
  // Note: 对齐各平台的路径分隔符
  return val.replace(/\\*\*\sfilePath:\s(.*)\s\*\*\//g, (replaceValue) => replaceValue.replace(/\\/g, '/'))
}

const mockFilePath = '/** filePath:mockFilePath **/'
export const parseSnapshotByFilePath = (val: string) => {
  const arr = val.split(new RegExp(os.EOL + '|\n'))
  let key = mockFilePath
  return arr.reduce((acc, cur) => {
    if (cur.startsWith('/** filePath:')) {
      key = cur.replace(/\\/g, '/')
      acc[key] = ''
    } else {
      acc[key] ||= ''
      if (acc[key] !== '') {
        acc[key] += '\n'
      }
      acc[key] += cur
    }
    return acc
  }, {})
}

export const snapshotObject2String = (val: Record<string, string>) => {
  const arr = Object.entries(val)
  const hasMockFilePath = arr.some(([key]) => key === mockFilePath) && arr.length <= 1
  return `${hasMockFilePath ? '' : '"\n'}${arr
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .filter(([key, value]) => (!!key && key !== mockFilePath) || (key === mockFilePath && !!value))
    .map(([key, value]) => `${key === mockFilePath ? '' : `${key}\n`}${value}`)
    .join('\n')}${hasMockFilePath ? '' : '"'}`
}

export const serialize = (
  val: any,
  // config: Config,
  // indentation: string,
  // depth: number,
  // refs: Refs,
  // printer: Printer,
) => {
  if (typeof val === 'string') {
    return snapshotObject2String(parseSnapshotByFilePath(val))
  }
  return val
}

export const test = (val: unknown) => typeof val === 'string'

export default {
  // print,
  serialize,
  test,
}
