/* eslint-disable */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sourceFileDist = resolve(__dirname, '..', 'dist/definition.json')

const targetFile = resolve(__dirname, '../..', 'babel-plugin-transform-taroapi/tests/__mocks__/h5-definition.json')

try {
  // 读取源文件内容
  const sourceContent = readFileSync(sourceFileDist, 'utf8')

  // 写入目标文件
  writeFileSync(targetFile, sourceContent, 'utf8')

  console.log('✅ 成功将definition.json内容覆盖到h5-definition.json')

} catch (error) {
  console.error('❌ 脚本执行失败:', error.message)
  process.exit(1)
}