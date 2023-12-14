import propsConfig from '@tarojs/plugin-platform-mpharmony/build/config/harmony-definition.json'
import * as fs from 'fs-extra'
import * as pathModule from 'path'

import DefinitionObj from '../interface/definitionObj'
import { parseApis, removeFalseProperties } from './parseApis'

export function generateDefinitionJSON () {
  const componentsPath = require.resolve('@tarojs/components/types/index.d.ts')
  const directoryPath = pathModule.dirname(componentsPath)
  const definitionObj: DefinitionObj = { apis: {}, components: {} }
  const finalDefinitionObj: DefinitionObj = { apis: {}, components: {} }

  function listFilesRecursively (dirPath: string) {
    const absolutePaths: string[] = []
    const traverseDirectory = (currentPath) => {
      const files = fs.readdirSync(currentPath)
      files.forEach((file) => {
        const filePath = pathModule.join(currentPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          traverseDirectory(filePath)
        } else {
          const fileName = pathModule.basename(filePath)
          // 检查文件名的首字母是否为大写字母
          if (/[A-Z]/.test(fileName[0])) {
            const absolutePath = pathModule.resolve(filePath)
            absolutePaths.push(absolutePath)
          }
        }
      })
    }
    traverseDirectory(dirPath)
    return absolutePaths
  }

  // 递归获取声明文件绝对路径数组
  const absolutePaths = listFilesRecursively(directoryPath)

  // 判断是否是需要继续解析的类型
  const baseType: string[] = ['object', 'any', 'number', 'string', 'boolean', 'symbol']
  const baseTypeArray: string[] = ['any[]', 'number[]', 'string[]']
  function isNeedParseType (type: string) {
    /**
     * 包括基本类型、基本类型数组、Aarry、Record、某些数组类型、对象类型或者单个对象等
     * 例如MapProps.marker[]、('push' | 'pop')[]、{ [key: string]: number | string | any }、MapProps
     */
    if (baseType.includes(type) || baseTypeArray.includes(type) || type.includes('Array<')
      || type.includes('Record<') || type.includes('[]') || /^\{[\s\S]*?\}$/.test(type)
      || /^[A-Z][a-zA-Z]*?$/.test(type)) {
      return false
    }
    return true
  }

  // 处理可能的联合类型，返回分割后的数组
  function handleUnionType (type: string) {
    /** 属性的类型可分为“|”分割的联合类型和不以“|”分割的其它类型，以下正则以“|”分割类型，但不包括{}、（）中的“|”
     *  (?![^{]*}|[^(]*\)) 表示负向前瞻，它要求接下来的字符不符合指定的条件，即以“|”分割，但这个分割符的后面不能是[^{]*}|[^(]*\)这2种模式
     */
    return type.split(/\s*\|\s*(?![^{]*}|[^(]*\))/).map(e => e.trim()).filter(e => e !== '' && e !== "''")
  }

  // 处理命名空间下interface的内容，并返回key数组
  function handleInterfaceProps (content: string) {
    return removeComments(content)
      .replace(/^\s+|\s+$/g, '') // 删除获取到的interface内容字符串的前后空格换行回车制表
      .replace(/^\s*\r?\n?/gm, '') // 删除多余空行
      .split(/\r?\n|\r/) // 分割属性,兼容所有系统
      .map(prop => prop.trim()) // 删除元素左右可能的空白
      .filter(prop => !prop.includes(' ')) // 属性是类似'top left'包含空格的字面量剔除掉
  }

  // 获取namespace下的interface中的键值数组
  function getInterfaceKeys (propTypeText = '', declareFileContent: string) {
    let keyArr: string[] = []
    if (propTypeText.includes('keyof ')) {
      const arr = propTypeText.split(' ')[1].split('.')
      // 根据组件属性的类型为keyof xxx类型的规律，arr[0]为namespace名称、arr[1]为interface的名称
      const interfacePattern = new RegExp(`namespace\\s*${arr[0]}[\\s\\S]*?interface\\s*${arr[1]}\\s*\\{([^{}]*)\\}`, 'g')
      let matchInterface: RegExpExecArray | null
      if ((matchInterface = interfacePattern.exec(declareFileContent)) !== null) {
        keyArr = handleInterfaceProps(matchInterface[1])
      }
    } else if (/^[A-Z][A-Za-z]*\.[A-Z][A-Za-z]*$/.test(propTypeText)) {
      const arr = propTypeText.split('.')
      // 特殊处理type OpenType = keyof openTypeKeys['weapp'] | keyof openTypeKeys['alipay'] | keyof openTypeKeys['qq'] | keyof openTypeKeys['tt']
      const typePattern = new RegExp(`namespace\\s*${arr[0]}[\\s\\S]*?type\\s*${arr[1]}\\s*=\\s*([\\s\\S]*?)(?=\\/\\*\\*)`, 'g')
      let matchType: RegExpExecArray | null
      if ((matchType = typePattern.exec(declareFileContent)) !== null) {
        handleUnionType(matchType[1].trim()).forEach(text => {
          let matchInterfaceName: RegExpExecArray | null
          if (text.includes("['weapp']") && (matchInterfaceName = /keyof\s([A-Za-z]*)\['weapp'\]/.exec(text)) != null) {
            let matchInterface: RegExpExecArray | null
            const interfacePattern = new RegExp(`namespace\\s*${arr[0]}[\\s\\S]*?interface\\s*${matchInterfaceName[1]}[\\s\\S]*?weapp:\\s*\\{([^{}]*)\\}`, 'g')
            if ((matchInterface = interfacePattern.exec(declareFileContent)) !== null) {
              keyArr = handleInterfaceProps(matchInterface[1])
            }
          }
        })
      }
    } else {
      return null
    }
    return keyArr
  }

  // 使用正则表达式剔除组件属性定义文本中/** */和//注释内容
  function removeComments (text: string) {
    return text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
  }

  // 将驼峰式命名转换为破折号命名且全小写
  function convertCamelToDash (str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  // 将字符串首字母转大写
  function capitalizeFirstLetter (str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // 遍历属性的类型，若可继续解析出属性则返回对象，否则返回‘''’
  function handlePropsType (propType: string, declareFileContent: string) {
    const propObj: object = {}
    const propTypeText = propType.trim()
    const typeArray = handleUnionType(propTypeText)
    // 长度大于1，说明是“|”分割的联合类型
    if (typeArray.length > 1) {
      // 联合类型转成对象
      typeArray.forEach(key => {
        if (isNeedParseType(key)) {
          // 联合类型的key可能是前后包含单引号的字符串（不包含keyof xxx或者aaa.bbb...类型）
          propObj[key.replace(/^'|'$/g, '')] = ''
        }
      })
    } else {
      if (!isNeedParseType(propTypeText)) {
        return ''
      } else {
        const keyArr = getInterfaceKeys(propTypeText, declareFileContent) ?? []
        keyArr.forEach(key => {
          propObj[key.replace(/^'|'$/g, '')] = '' // 需移除字符串字面量属性前后单引号
        })
      }
    }

    if (Object.keys(propObj).length === 0) {
      return ''
    } else {
      return propObj
    }
  }

  // 根据组件的属性interface内容生成对象
  function getPropsObject (popsContent: string, declareFileContent: string) {
    // 匹配组件的某条属性，包括它的注释
    const propsPattern = /(\/\*\*[\s\S]*?\*\/[\s\S]*?)(?=\/\*\*|}$)/g
    // 匹配组件的某条属性上方注释中是否包含@supported ...weapp
    const isSupportedPattern = /@supported[^*]*?weapp/g
    const allMatches: string[] = []
    let propsMatches: RegExpExecArray | null
    // 从组件属性inteface文本中循环匹配所有属性及其注释
    while ((propsMatches = propsPattern.exec(popsContent)) !== null) {
      // 如果属性注释支持weapp则继续处理
      if (propsMatches[1].match(isSupportedPattern)) {
        // 删除注释并清除属性内容文本左右空格、换行、回车
        const propText = removeComments(propsMatches[1]).replace(/^\s+|\s+$/g, '')
        // 某些属性可能被//注释，需要做下判断
        if (propText) {
          allMatches.push(propText)
        }
      }
    }
    // 过滤函数相关属性，从发现函数模式属性位置开始删除当前及之后的数组元素
    for (let i = 0; i < allMatches.length; i++) {
      if (/^on[A-Z][a-zA-Z]*?\??:/.test(allMatches[i])) {
        allMatches.splice(i)
        break
      }
    }
    const JSONStr = allMatches
      .map(item => item.replace('?:', ':')) // 将?:替换为:
      .map(item => item.replace(/\r?\n|\r/g, ' ')) // 有些属性的类型值可能会跨行，将回车加可能的多个空格替换为单个空格,兼容所有系统
      .map(item => item.replace(/ +/g, ' '))
      .map(item => item.replace(/([^:]+):\s?(.*)/g, '"$1":"$2"')) // 冒号前后的内容用双引号括起来以便进行JSON字符串转换
      .join(',') // 将转换后的数组元素用逗号拼接起来
    
    let propsObject: object
    try {
      propsObject = JSON.parse(`{${JSONStr}}`)
    } catch (error) {
      propsObject = {}
    }
    
    const result: object = {}
    for (const [key, value] of Object.entries(propsObject)) {
      const newKey = convertCamelToDash(key)
      result[newKey] = handlePropsType(value as string, declareFileContent)
    }
    return result
  }

  // 根据组件定义的属性interface名称获取获取属性interface内容
  function getPropsInterfaceContent (propsName: string, declareFileContent: string) {
    const flag = `interface ${propsName}`
    const startIndex = declareFileContent.indexOf(flag)
    if (startIndex > 0) {
      let propsContent = ''
      let stack = 0
      let findFirst = false
      let flag = false
      for (let i = startIndex; i < declareFileContent.length && (!findFirst || stack > 0); i++) {
        if (declareFileContent[i] === '{') {
          flag = true
          findFirst = true
          stack += 1
        } else if (declareFileContent[i] === '}') {
          stack -= 1
        }
        if (flag) {
          propsContent += declareFileContent[i]
        }
      }
      return propsContent
    }
    return null
  }

  function getComponentProps (declareFilePath: string) {
    const declareFileContent = fs.readFileSync(declareFilePath, 'utf-8') // 读取声明文件文本内容
    const componentName = pathModule.basename(declareFilePath).replace('.d.ts', '') // 剔除文件扩展名，获取组件的名称
    const componentNameWithDash = convertCamelToDash(componentName) // 将组件名转换为“-”连接，且均为小写字母
    const propsName = componentName === 'Picker' ? componentName.concat('StandardProps') : componentName.concat('Props') // Picker组件的属性interface名称特殊，单独区分

    const propsContent = getPropsInterfaceContent(propsName, declareFileContent)
    if (propsContent) {
      const propsObject = getPropsObject(propsContent, declareFileContent)
      // 当前weapp不支持PullToRefreshProps，暂不处理PullToRefreshProps组件
      if (propsName !== 'PullToRefreshProps') {
        definitionObj.components[componentNameWithDash] = Object.keys(propsObject).length === 0 ? '' : propsObject
      }
    } else {
      definitionObj.components[componentNameWithDash] = ''
    }

    // Picker组件包含多种模式，单独解析
    if (componentName === 'Picker') {
      const modeObj = definitionObj.components[componentNameWithDash].mode ?? {}
      for (const key in modeObj) {
        const modePropsName = componentName.concat(capitalizeFirstLetter(key)).concat('Props')
        const modePropsContent = getPropsInterfaceContent(modePropsName, declareFileContent)
        if (modePropsContent) {
          const propsObject = getPropsObject(modePropsContent, declareFileContent)
          definitionObj.components[componentNameWithDash].mode[key] = Object.keys(propsObject).length === 0 ? '' : propsObject
        }
      }
    }
  }

  // 遍历组件声明文件并获取组件的属性对象
  absolutePaths.forEach(getComponentProps)

  // 获取组件支持的属性
  function getComponentsDefinition (componentProps: object, componentsConfig: object) {
    const componentDefinition: object = {}

    for (const key in componentsConfig) {
      if (componentProps.hasOwnProperty(key)) {
        if (typeof componentsConfig[key] === 'object' && typeof componentProps[key] === 'object') {
          const ret = getComponentsDefinition(componentProps[key], componentsConfig[key])
          if (Object.keys(ret).length > 0) {
            componentDefinition[key] = ret
          }
        } else if (typeof componentsConfig[key] === 'boolean' && componentProps[key] === '') {
          if (componentsConfig[key]) { componentDefinition[key] = componentProps[key] }
        } else {
          delete componentsConfig[key]
        }
      } else {
        // 如果原始配置中的某个属性不在从声明文件提取的属性中，则将这个属性从原始配置中删除
        delete componentsConfig[key]
      }
    }

    return componentDefinition
  }

  // 获取API的描述信息
  function getApisDefinition (apisConfig: object) {
    removeFalseProperties(apisConfig)
    return apisConfig
  }

  // 更新组件属性配置
  function updatePropsConfig (componentProps: object, componentsConfig: object) {
    const newComponentsConfig: object = componentsConfig
    // 遍历声明文件提取的属性，如果原始配置中不存在该属性，则添加到配置中，并赋值默认值false
    for (const key in componentProps) {
      if (!componentsConfig.hasOwnProperty(key)) {
        if (typeof componentProps[key] === 'object') {
          newComponentsConfig[key] = updatePropsConfig(componentProps[key], {})
        } else {
          newComponentsConfig[key] = false
        }
      } else {
        if (typeof componentProps[key] === 'object' && typeof componentsConfig[key] === 'object') {
          newComponentsConfig[key] = updatePropsConfig(componentProps[key], componentsConfig[key])
        }
      }
    }
    return newComponentsConfig
  }

  // keys按字母顺序排序
  function sortKeys (obj: object) {
    const sortedKeys = Object.keys(obj).sort()
    const sortedObj = sortedKeys.reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
    return sortedObj
  }

  // 获取最终的组件和API属性配置表同时更新原始属性配置文件
  function getFinalDefinitionObj (componentProps: object, componentsConfig: any) {
    const apisConfig = parseApis()
    finalDefinitionObj.components = getComponentsDefinition(componentProps, componentsConfig)
    
    // 更新组件属性配置文件
    const newComponentsConfig = updatePropsConfig(componentProps, componentsConfig)

    fs.writeJSONSync('build/config/harmony-definition.json', { 'apis': sortKeys(apisConfig), 'components': sortKeys(newComponentsConfig) }, { spaces: 2 })
    finalDefinitionObj.apis = getApisDefinition(apisConfig)
  }

  getFinalDefinitionObj(definitionObj.components, propsConfig.components)

  // 写入文件
  fs.ensureDirSync('dist')
  fs.writeJSONSync('dist/definition.json', finalDefinitionObj, { spaces: 2 })
}