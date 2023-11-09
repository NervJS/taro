/**
 * mock resolve方法
 * 
 * @param  {...any} pathArray 
 * @returns 
 */
function resolveMock (...pathArray) {
  if (pathArray === undefined) {
    return ''
  }

  if (pathArray.length === 0) {
    return ''
  } else if (pathArray.length === 1) {
    pathArray[0] = normalizePath(pathArray[0])
    return `/${pathArray[0]}`
  } else if (pathArray.length === 2) {
    pathArray[0] = normalizePath(pathArray[0])
    pathArray[1] = normalizePath(pathArray[1])
    if (pathArray[1].startsWith('./')) {
      pathArray[1] = pathArray[1].replace('./', '')
    }
    return `/${pathArray.join('/')}`
  } else if (pathArray.length === 3) {
    pathArray[0] = normalizePath(pathArray[0])
    pathArray[1] = normalizePath(pathArray[1])
    pathArray[2] = normalizePath(pathArray[2])
    const newPathArray = []
    pathArray.forEach(path => {
      if (path.startsWith('./')) {
        newPathArray.push(path.replace('./', ''))
        return
      }
      newPathArray.push(path)
    })
    if (newPathArray[1].includes('..')) {
      return `${dirnameMock(newPathArray[0])}/${newPathArray[2]}`
    }
  }
  return `/${pathArray.join('/')}`
}

/**
 * mock dirname 方法
 * 
 * @param { string } filePath 
 * @returns 
 */
function dirnameMock (filePath) {
  // 使用正则表达式匹配路径中的最后一个目录分隔符或斜杠
  const regex = /[\\/]/g
  const matches = []
  let match

  while ((match = regex.exec(filePath)) !== null) {
    matches.push(match.index)
  }

  if (matches.length === 0) {
    // 如果没有匹配到目录分隔符，则返回空字符串
    return ''
  }

  // 截取路径中的目录部分
  const lastIndex = matches[matches.length - 1]
  return filePath.slice(0, lastIndex)
}

/**
 * 路径格式化
 * 
 * @param { string } path 
 * @returns 
 */
function normalizePath (path) {
  return path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
}

module.exports = {
  ...jest.requireActual('path'),
  resolve: jest.fn((...pathArray) => resolveMock(...pathArray)),
  dirname: jest.fn((path) => dirnameMock(path)),
}