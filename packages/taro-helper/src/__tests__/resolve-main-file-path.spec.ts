import * as path from 'path'

import { resolveMainFilePath } from '../utils'

describe('resolveMainFilePath', () => {
  it('should return the same path if it starts with "pages/" or is "app.config"', () => {
    const input1 = 'pages/home/index.config'
    const input2 = 'app.config'
    expect(resolveMainFilePath(input1)).toBe(input1)
    expect(resolveMainFilePath(input2)).toBe(input2)
  })

  it('should return the path with the file extension if the file exists', () => {
    const configPath = path.join(__dirname, './__mocks__/app.config.ts')
    const parsedPath = path.parse(configPath)
    expect(resolveMainFilePath(path.join(parsedPath.dir, parsedPath.name))).toBe(configPath)
  })

  it('存在多端页面但是对应的多端页面配置不存在时，使用该页面默认配置', () => {
    process.env.TARO_ENV = 'weapp'
    const configPath = path.join(__dirname, './__mocks__/app.config.ts')
    const configEnvPath = path.join(__dirname, './__mocks__/app.weapp.config.ts')
    const parsedPath = path.parse(configEnvPath)
    expect(resolveMainFilePath(path.join(parsedPath.dir, parsedPath.name))).toBe(configPath)
  })
})
