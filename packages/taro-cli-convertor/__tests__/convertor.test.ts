import { normalizePath } from '@tarojs/helper'

import Convertor from '../src/index'
import { clearMockFiles, getResMapFile, setMockFiles, updateMockFiles } from './__mocks__/fs-extra.js'
import {
  CONVERT_CONFIG_DATA,
  DEMO_JS_FILE_INFO,
  DEMO_JS_FILE_INFO_MINIPROGRANROOT,
  DEMO_JS_FILES,
  DEMO_SUBPACKAFES,
  DEMO_TABBER,
  PLUGIN_FILE_DATA,
  root,
  USINGCOMPONENTS_FILE_DATA,
} from './data/fileData'
import { removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const path = require('path')

jest.mock('path')

describe('微信小程序转换', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterAll(()=>{
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('小程序demo转换', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILE_INFO)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('配置miniprogramRoot的demo小程序转换', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILE_INFO_MINIPROGRANROOT)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('小程序插件转换', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILE_INFO_MINIPROGRANROOT)
    updateMockFiles(root, PLUGIN_FILE_DATA)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('小程序tabber转换',() => {
    setMockFiles(root,DEMO_TABBER)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('小程序分包',() => {
    setMockFiles(root,DEMO_SUBPACKAFES)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('三方库转换',() => {
    const EDMO_ThIREdPARTYLIB = {
      '/pages/index/index.js': `
        import moment from 'moment'
        Page({
          data:{
            time:moment(new Date()).format('YYYY-MM-DD')
          }
        })
      `,
      '/pages/index/index.wxml': `<view>{{time}}</view>`,
      '/node_modules/moment': {
        '/dist':{
          '/locale':{
            '/af.js':'123'
          },
          '/moment.js':'format(){}'
        }
      } 
    }
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, EDMO_ThIREdPARTYLIB)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('使用工具函数初始化page页面',() => {
    const EDMO_CREATEPAGE = {
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
      '/pages/index/index.js': `
        const { createPage } = require('../../utils/tools')
        createPage({})
      `,
      '/utils/tools.js': `
        module.exports.createPage = function(options) {
          Page(options)
        }
      `
    }
    updateMockFiles(root, EDMO_CREATEPAGE)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})

describe('配置文件解析转换', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterAll(()=>{
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('适配convert.config.json，对匹配json内路径的文件，在其被导入时所在的文件夹不做转换', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, CONVERT_CONFIG_DATA)

    const convert = new Convertor(root, false)
    convert.generateScriptFiles(new Set([normalizePath(path.join(root, '/mps/index/index.js'))]))
    const resFileMap = getResMapFile()
    expect(resFileMap.get('/wxProject/taroConvert/src/mps/index/index.js').replace(/[\n\r]/g, '')).toEqual(
      CONVERT_CONFIG_DATA['/mps/index/index.js']
    )
  })

  test('小程序sitemap.json文件的转换',() => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    const DEMO_SITEMAP = {
      '/app.json': `
        {
          "pages": [
            "pages/index/index"
          ],
          "sitemapLocation":"./sitemap.json"
        }
      `,
      '/sitemap.json':`
        {
          "rules":[{
            "action": "allow",
            "page": "*"
          }]
        }
      `
    }
    updateMockFiles(root, DEMO_SITEMAP)
    const convert = new Convertor(root, false)
    convert.getSitemapLocation()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})

describe('文件转换', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterAll(()=>{
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('文件中包含commonjs导出转换', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)

    // js文件中包含commonjs导出
    const COMMONJS_EXPORTS_DATA = {
      '/utils/util.js': `
        function getData(url) {
          wx.request({
            url: 'url',
          })
        }
        module.exports.getData = getData
      `,
    }
    updateMockFiles(root, COMMONJS_EXPORTS_DATA)

    const convert = new Convertor(root, false)
    convert.generateScriptFiles(new Set([normalizePath(path.join(root, '/utils/util.js'))]))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  // 因wxss的解析函数是异步，样式文件的转换在结果返回之后，用例运行正常说明转换正常
  test('wxss的注释中引用自身文件', () => {
    // 场景1：wxss的注释中引用自身文件
    // 场景2：wxss引用其他wxss文件
    // 场景2：wxss引用的wxss文件内容为空
    setMockFiles(root, DEMO_JS_FILE_INFO)

    const COMMENT_PAGE_DATA = {
      '/pages/commentPage/commentPage.js': `
        Page({
          data: {}
        });
      `,
      '/pages/commentPage/commentPage.wxml': `<view></view>`,
      '/pages/commentPage/commentPage.json': `
        {
          "usingComponents": {}
        }
      `,
      '/pages/commentPage/commentPage.wxss': `
        /* 
          @import "./commentPage.wxss"
        */
        #add {
          margin: 1em;
        }
      `,
    }
    updateMockFiles(root, COMMENT_PAGE_DATA)

    const convert = new Convertor(root, false)
    convert.framework = 'react'
    convert.traversePages(root, new Set(['/pages/commentPage/commentPage']))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('一个文件夹下有多个wxml页面导致显示异常', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILES)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})

describe('模版转换', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterAll(()=>{
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('简单模版转换，向模版中传递一个变量', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)

    // js文件中包含commonjs导出
    const TEMPLATE_DATA = {
      '/pages/simpleTemplatePage/simpleTemplatePage.js': `
        Page({
          data: {
            name: 'hello'
          }
        });
      `,
      '/pages/simpleTemplatePage/simpleTemplatePage.wxml': `
        <import src="../../templates/simpleTemplate.wxml" />
        <template is="huangye" data="{{name}}"/>
      `,
      '/pages/simpleTemplatePage/simpleTemplatePage.json': `
        {
          "usingComponents": {}
        }
      `,
      '/templates/simpleTemplate.wxml': `
        <template name="huangye">
          {{name}}
        </template>
      `,
    }
    updateMockFiles(root, TEMPLATE_DATA)

    const convert = new Convertor(root, false)
    convert.framework = 'react'
    convert.traversePages(root, new Set(['/pages/simpleTemplatePage/simpleTemplatePage']))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('简单模版转换，向模版中传递多个变量', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)

    // js文件中包含commonjs导出
    const TEMPLATE_DATA = {
      '/pages/mulVarTemplatePage/mulVarTemplatePage.js': `
        Page({
          data: {
            name: 'hello',
            age: 12
          }
        });
      `,
      '/pages/mulVarTemplatePage/mulVarTemplatePage.wxml': `
        <import src="../../templates/mulVarTemplate.wxml" />
        <template is="huangye" data="{{name, age}}"/>
      `,
      '/pages/mulVarTemplatePage/mulVarTemplatePage.json': `
        {
          "usingComponents": {}
        }
      `,
      '/templates/mulVarTemplate.wxml': `
        <template name="huangye">
          {{name}} {{age}}
        </template>
      `,
    }
    updateMockFiles(root, TEMPLATE_DATA)

    const convert = new Convertor(root, false)
    convert.framework = 'react'
    convert.traversePages(root, new Set(['/pages/mulVarTemplatePage/mulVarTemplatePage']))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('模版转换，模版名为变量', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)

    // js文件中包含commonjs导出
    const TEMPLATE_DATA = {
      '/pages/templatePage_tempNameIsVar/templatePage_tempNameIsVar.js': `
        Page({
          data: {
            name: 'hello',
            age: 12,
            templateName: 'template1'
          }
        });
      `,
      '/pages/templatePage_tempNameIsVar/templatePage_tempNameIsVar.wxml': `
        <import src="../../templates/tempNameIsVarTemplate.wxml" />
        <template is="{{templateName}}" data="{{name, age}}"/>
      `,
      '/pages/templatePage_tempNameIsVar/templatePage_tempNameIsVar.json': `
        {
          "usingComponents": {}
        }
      `,
      '/templates/tempNameIsVarTemplate.wxml': `
        <template name="template1">
          {{name}}
        </template>

        <template name="template2">
          {{age}}
        </template>
      `,
    }
    updateMockFiles(root, TEMPLATE_DATA)

    const convert = new Convertor(root, false)
    convert.framework = 'react'
    convert.traversePages(root, new Set(['/pages/templatePage_tempNameIsVar/templatePage_tempNameIsVar']))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('模版转换，模版名包含变量', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)

    // js文件中包含commonjs导出
    const TEMPLATE_DATA = {
      '/pages/templatePage_tempNameContainsVar/templatePage_tempNameContainsVar.js': `
        Page({
          data: {
            name: 'hello',
            age: 12,
            lateName: 'template1'
          }
        });
      `,
      '/pages/templatePage_tempNameContainsVar/templatePage_tempNameContainsVar.wxml': `
        <import src="../../templates/tempNameContainsVarTemplate.wxml" />
        <template is="temp{{lateName}}" data="{{name, age}}"/>
      `,
      '/pages/templatePage_tempNameContainsVar/templatePage_tempNameContainsVar.json': `
        {
          "usingComponents": {}
        }
      `,
      '/templates/tempNameContainsVarTemplate.wxml': `
        <template name="template1">
          {{name}}
        </template>

        <template name="template2">
          {{age}}
        </template>
      `,
    }
    updateMockFiles(root, TEMPLATE_DATA)

    const convert = new Convertor(root, false)
    convert.framework = 'react'
    convert.traversePages(root, new Set(['/pages/templatePage_tempNameContainsVar/templatePage_tempNameContainsVar']))
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})

describe('公共组件引用', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterAll(()=>{
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('子组件内部标签引用公共组件时，解析app.json文件里公共组件,使子组件生效',()=>{

    // 设置初始文件信息
    setMockFiles(root, PLUGIN_FILE_DATA)
    updateMockFiles(root, USINGCOMPONENTS_FILE_DATA)
    const convert = new Convertor(root, false)
    convert.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})

