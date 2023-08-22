export const baseOptions = {
  isRoot: false,
  isApp: false,
  sourcePath: __dirname,
  outputPath: __dirname,
  sourcetDir: __dirname,
  code: '',
  isTyped: false,
  isNormal: true,
}

// 去除字符串每行前面的空格
export function removeFrontBlank(str: string | undefined) {
  if (str === undefined) {
    return ''
  }
  return str.replace(/^\s+/gm, '')
}
