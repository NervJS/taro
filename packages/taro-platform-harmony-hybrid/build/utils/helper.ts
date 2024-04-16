/**
 * 对象键按字母顺序排序
 * @param obj
 * @returns
 */
export function sortKeys (obj: object) {
  const sortedKeys = Object.keys(obj).sort()
  const sortedObj = sortedKeys.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {})
  return sortedObj
}

/**
 * 驼峰式命名转全小写破折号命名
 * @param str
 * @returns
 */
export function convertCamelToDash (str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 删除注释文本
 * @param text
 * @returns
 */
export function removeComments (text: string) {
  return text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
}

/**
 * 字符串首字母转大写
 * @param str
 * @returns
 */
export function capitalizeFirstLetter (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 删除对象中值为false的属性,并将值为true的属性值改为''
 * @param obj
 */
export function removeFalseProperties (obj: object) {
  for (const prop in obj) {
    if (obj[prop] === false) {
      delete obj[prop]
    } else if (typeof obj[prop] === 'object') {
      removeFalseProperties(obj[prop]) // 递归处理子对象
      if (Object.keys(obj[prop]).length === 0) {
        delete obj[prop] // 如果子对象处理完毕后为空，则删除父对象中的属性
      }
    } else {
      obj[prop] = ''
    }
  }
}

/**
 * 将属性值全部赋值为false
 * @param obj
 */
export function setPropertiesValue (obj: object) {
  for (const prop in obj) {
    if (typeof obj[prop] === 'object') {
      setPropertiesValue(obj[prop]) // 递归处理子对象
    } else {
      obj[prop] = false
    }
  }
}
