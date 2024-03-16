/**
 * mock join方法
 * 
 * @param  {...string} pathSegments 
 * @returns 
 */
function joinMock (...pathSegments) {
  // 定义一个函数来处理路径段
  const processPathSegment = (segment) => {
    // 去掉两头的/和./
    if (segment === '.' || segment === '') {
      return false
    }
    return true
  }

  // 初始化一个数组用于保存最终路径的各个部分
  const finalPathSegments = []

  for (let segment of pathSegments) {
    // 将路劲中的 `\\` 替换为 `/` (示例："E:\\code\\taro-16\\packages\\taro-cli")
    if(segment.includes(`\\`)){
      segment = segment.replace(/\\/g, '/')
    }
    
    // 去掉路径段两端的斜杠并分割路径
    const segments = segment.split('/').filter(processPathSegment)

    // 处理路径段中的 `..` 
    for (const subSegment of segments) {
      if (subSegment === '..') {
        // 如果是 `..`，则回退一层
        finalPathSegments.pop()
      } else {
        // 否则，添加到最终路径中
        finalPathSegments.push(subSegment)
      }
    }
  }

  // 根据是否为绝对路径返回最终路径
  const isAbsolutePath = pathSegments[0].startsWith('/')

  const joinedPath = finalPathSegments.join('/')

  if (isAbsolutePath) {
    return '/' + joinedPath
  } else {
    return joinedPath
  }
}

module.exports = {
  ...jest.requireActual('path'),
  join: jest.fn((...pathArray) => joinMock(...pathArray)),
}