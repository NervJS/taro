import * as fsExtra from 'fs-extra'

import hosDefinition from './config/harmony-definition.json'
import { parseApis } from './definition-json/parseApis'
import { parseComponents } from './definition-json/parseCommponents'
import { getDeclaredApis } from './utils/getDeclaredApis'
import { removeFalseProperties, setPropertiesValue,sortKeys } from './utils/helper'

function exportAbsentTaroApi (declaredApiList: string[], existApiList: string[]) {
  const taroH5Path = '@tarojs/taro-h5'
  const exportApis = declaredApiList.filter(api => !existApiList.includes(api)).sort((a, b) => a.localeCompare(b)).filter(api => api !== 'getCommonConfig')
  let code = '\n/** 该文件由脚本自动生成，请勿自行修改 */\n'
  code += `export {\n  ${exportApis.join(',\n  ')}\n} from '${taroH5Path}'\n`
  const entryPath = require.resolve('@tarojs/plugin-platform-harmony-mini/src/api/apis/extend-h5.ts')
  
  fsExtra.ensureFileSync(entryPath)
  fsExtra.writeFileSync(entryPath, code, 'utf-8')
}

function generateDeclaredApis (declareApis: object) {
  fsExtra.writeJSONSync('build/config/declared-taro-apis.json', declareApis, { spaces: 2 })
}

function generateHarmonyDefinition (apisCfg: object, componentsCfg: object) {
  const harmonyDefinition: { apis: object, components: object } = { apis: {}, components: {} }
  harmonyDefinition.apis = sortKeys(apisCfg)
  harmonyDefinition.components = sortKeys(componentsCfg)
  fsExtra.writeJSONSync('build/config/harmony-definition.json', harmonyDefinition, { spaces: 2 })
}

function generateFinalDefinition (apisCfg: object, componentsCfg: object) {
  const finalDefinition: { apis: object, components: object } = { apis: {}, components: {} }
  removeFalseProperties(apisCfg)
  removeFalseProperties(componentsCfg)
  finalDefinition.apis = apisCfg
  finalDefinition.components = componentsCfg
  fsExtra.ensureDirSync('dist')
  fsExtra.writeJSONSync('dist/definition.json', finalDefinition, { spaces: 2 })
}

// 删除组件配置中未声明的组件及属性
function deleteComponentsCfg (config: object, declared: object) {
  for (const key in config) {
    if (declared.hasOwnProperty(key)) {
      if (typeof config[key] === 'object' && typeof declared[key] === 'object') {
        deleteComponentsCfg(config[key], declared[key])
      } else if (typeof config[key] === 'boolean' && declared[key] === '') {
        continue
      } else {
        delete config[key]
      }
    } else {
      delete config[key]
    }
  }
}

// 在组件配置中新增已声明的组件及属性
function addComponentsCfg (config: object, declared: object) {
  for (const key in declared) {
    if (!config.hasOwnProperty(key)) {
      if (typeof declared[key] === 'object') {
        const cfg = declared[key]
        setPropertiesValue(cfg)
        config[key] = cfg
      } else {
        config[key] = false
      }
    } else {
      if (typeof declared[key] === 'object' && typeof config[key] === 'object') {
        addComponentsCfg(config[key], declared[key])
      }
    }
  }
}

// 已添加注释的API信息对象（不含canIUse）
const apisDefinition = parseApis()

// Taro已声明的组件信息对象
const componentsDefinition = parseComponents()

// 获取Taro已声明的API列表（剔除框架接口及canIUse）
const extraApi = ['getApp', 'getCurrentPages', 'canIUse']
// 不含console、env、cloud
const declareApis = getDeclaredApis()
const declaredApiList = Object.keys(declareApis).filter(api => !extraApi.includes(api))
declaredApiList.push('env', 'cloud', 'initTabBarApis')

// 获取已存在的API列表（剔除实例对象）
const existApiList = Object.keys(apisDefinition).filter(api => !/^[A-Z]/.test(api))

// harmony平台未添加的API以继承H5的方式导出
exportAbsentTaroApi(declaredApiList, existApiList)

// 更新apisDefinition
const needToAdd = declaredApiList.filter(api => !existApiList.includes(api))
needToAdd.forEach(api => {
  apisDefinition[api] = false
})

// 更新组件信息配置
const componentsCfg = hosDefinition.components
deleteComponentsCfg(componentsCfg, componentsDefinition)
addComponentsCfg(componentsCfg, componentsDefinition)

// 生成taro已声明api配置
generateDeclaredApis(declareApis)

// 生成harmony-definition.json配置
generateHarmonyDefinition(apisDefinition, componentsCfg)

// 生成dist/definition.json配置
generateFinalDefinition(apisDefinition, componentsCfg)