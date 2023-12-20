import * as taroize from '@tarojs/taroize'
import * as path from 'path'

import Convertor from '../src/index'
import { setMockFiles, updateMockFiles } from './__mocks__/fs-extra'
import { DEMO_JS_FILE_INFO, root } from './data/fileData'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

interface ITaroizeOptions {
  json?: string
  script?: string
  wxml?: string
  path?: string
  rootPath?: string
  scriptPath?: string
  logFilePath?: string
}

describe('parseAst', () => {
  let convert
  let param: ITaroizeOptions
  beforeEach(() => {
    const entryJSON = { pages: ['pages/index/index'] }
    /**
     * json：index.json的内容
     * path：index的根目录（文件路径)
     * rootPath：小程序的根目录（文件路径）
     * script：index.js的内容
     * scriptPath：index.js的绝对路径
     * wxml：index.html的内容
     * logFilePath：convert.log的文件路径
     */
    param = {
      json: '{}',
      path: '',
      rootPath: '',
      script: '',
      scriptPath: '',
      wxml: '',
      logFilePath: '',
    }

    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})

    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('当使用e.target.dataset时引入工具函数 getTarget', () => {
    param.script = `
      app.createPage({
        data:{
          tagInfo:{
            id:123456,
            data:'茅台',
          },
          msg:'',
          tagName:{}  
        },
        getMsg(e){
          const detail = e.currentTarget
          //变量赋值
          const tagName_ = e.currentTarget.dataset.tagName
          const tagData_ = e.currentTarget.dataset.tagData
          //结构赋值
          const { tagName } = e?.target?.dataset
          const { tagData } = e?.target?.dataset
        },
        getMsg02(e){
          const detail = e.currentTarget
          const tagname_ = e.currentTarget.dataset.tagname
          const tagdata_ = e.currentTarget.dataset.tagdata
          const { tagname } = detail?.dataset
          const { tagdata } = detail?.dataset
        },
      })
    `

    param.wxml = `
      <view>测试data-xxx-xxx写法</view>
      <button data-tag-name="WX1314" data-tag-data="{{ tagInfo }}" bindtap="getMsg">获取</button>
      <view>测试data-xxxXxxx 驼峰写法</view>
      <button data-tagName="WX1314" data-tagData="{{ tagInfo }}" bindtap="getMsg02">获取</button>
      `

    // 解析wxml的时候有缓存，需保证test的path唯一
    param.path = 'e_target_dataset'
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  // 测试require
  // 场景1：require引用为空
  test('require引用为空', () => {
    param.script = `const aa = require()`
    param.wxml = ''

    // 解析wxml的时候有缓存，需保证test的path唯一
    param.path = 'require'

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  // 场景1：require引用包含变量
  test('require引用包含变量', () => {
    param.script = `const aa = require('aa' + aa)`
    param.wxml = ''

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    expect(() =>
      convert.parseAst({
        ast: taroizeResult.ast,
        sourceFilePath: '',
        outputFilePath: '',
        importStylePath: '',
        depComponents: new Set(),
        imports: [],
      })
    ).toThrow()
  })

  // 测试数据添加可选链操作符
  test('为data数据添加可选链操作符', () => {
    param.script = `
      Page({
        data: {
          testString: '',
          testArray: [],
          testUnArray: undefined,
        },
      })
    `
    param.wxml = `
      <view>
        {{testString.trim()}}
      </view>

      <view wx:for="{{testArray[0].children}}">
        {{item}}
      </view>
    
      <view wx:for="{{testUnArray[1].children}}">
        {{item}}
      </view>
    `
    param.path = 'data_optional'

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('为setData数据添加可选链操作符', () => {
    param.script = `
      Page({
        onLoad() {
          let list = []
          let dcopy = []
          list.push({
            children: [0,1,2,3,4,5],
          })
          list.push({
            children: [0,1,2,3,4],
          })
          this.setData({
            list,
            dcopy: [0,1,2,3,4,5],
          })
        },
      })
    `
    param.wxml = `
      <view wx:for="{{list[0].children}}">
        {{item}}
      </view>
  
      <view wx:for="{{dcopy}}">
          {{item}}
      </view>
    `
    param.path = 'setdata_optional'

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  // 按需导入
  test('自定义组件按需导入', () => {
    // 构造导入的组件集合depComponents
    const depComponents = new Set([
      {
        name: 'component-a',
        path: '/project/components/a',
      },
      {
        name: 'component-b',
        path: '/project/components/b',
      },
      {
        name: 'component-c',
        path: '/project/components/c',
      },
    ])
    param.script = ``
    param.wxml = `
      <component-a name="a" />
      <component-b name="b" />
      <!-- <component-c name="c" /> -->
    `
    param.path = 'components_import'

    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '/project/pages/index',
      outputFilePath: '',
      importStylePath: '',
      depComponents,
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('模板按需导入', () => {
    // index使用模板A，imports传回模板A、B、C
    param.script = ``
    param.wxml = `
      <template is="template-a" />
    `
    param.path = 'templates_import'
    jest.spyOn(convert.hadBeenBuiltImports, 'has').mockReturnValue(true)
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })
    // 按照实际情况，构造imports
    const imports = [
      {
        ast: { type: 'File', program: [Object], comments: null, tokens: null },
        name: 'TemplateATmpl',
      },
      {
        ast: { type: 'File', program: [Object], comments: null, tokens: null },
        name: 'TemplateBTmpl',
      },
      {
        ast: { type: 'File', program: [Object], comments: null, tokens: null },
        name: 'TemplateDTmpl',
      },
    ]

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports,
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('转换后模块名重名时，为导入的组件模块名添加Component后缀，以示区分', () => {
    const COMPONENT_IMPORT = {
      '/pages/index/index.js': `
        import Jstest from '../../components/test.js'
        import {Mymodule, Mymodules} from '../../components/test.js'
        Page({})
      `,
      '/pages/index/index.json': `
        {
          "usingComponents": {
            "jstest": "../../components/my-component",
            "mymodule": "../../components/my-component",
            "mymodule1": "../../components/my-component"
          }
        }
      `,
      '/components/my-component': `
        <view class="container">
          <text>{{text}}</text>
          <button class="btn" bindtap="handleClick">{{buttonText}}</button>
        </view>
      `,
      '/components/test.js': ``,
    }
    setMockFiles(root, COMPONENT_IMPORT)

    param.path = path.join(root, '/pages/index/index')
    param.script = `
      import Jstest from '../../components/test.js'
      import {Mymodule, Mymodules} from '../../components/test.js'
      Page({})
    `
    param.scriptPath = path.join(root, '/pages/index/index.js')
    param.wxml = `
      <Jstest></Jstest>
      <Mymodule></Mymodule>
      <Mymodules></Mymodules>
    `
    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })
    const depComponents = new Set([
      {
        name: 'jstest',
        path: path.join(root, '/components/my-component'),
      },
      {
        name: 'mymodule',
        path: path.join(root, '/components/my-component'),
      },
      {
        name: 'mymodules',
        path: path.join(root, '/components/my-component'),
      },
    ])

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: param.scriptPath,
      outputFilePath: '',
      importStylePath: '',
      depComponents,
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('对图片路径的转换处理', () => {
    const CONVERT_IMAGE = {
      '/images/tutu.jpg': '图片',
      '/pages/index/index.js': 'Page({})',
      '/pages/index/index.wxml': '<image src="/images/tutu.jpg" mode=""/>',
    }
    setMockFiles(root, CONVERT_IMAGE)
    param.path = path.join(root, '/pages/index/index')
    param.script = `Page({})`
    param.scriptPath = path.join(root, '/pages/index/index.js')
    param.wxml = `<image src="/images/tutu.jpg" mode=""/>`

    convert = new Convertor(root, false)

    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: param.scriptPath,
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('模板中使用function', () => {
    const TEMPLATE_FUNCTION = {
      '/pages/index/index.wxml': `
        <import src="/template/item"/>
        <template is="item" data="{{text: 'forbar'}}"/>
      `,
      '/pages/index/index.js': `
        Page({
          onClick(){
            console.log('click')
          }
        })
      `,
      '/template/item.wxml': `
        <template name="item">
          <button bind:tap="onClick">按钮</button>
        </template>
      `,
    }
    setMockFiles(root, TEMPLATE_FUNCTION)

    param.path = path.join(root, '/pages/index/index')
    param.script = `
      Page({
        onClick(){
          console.log('click')
        }
      })
    `
    param.scriptPath = path.join(root, '/pages/index/index.js')
    param.wxml = `
      <import src="/template/item"/>
      <template is="item" data="{{text: 'forbar'}}"/>
    `
    param.rootPath = root

    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: path.join(root, '/pages/index/index.js'),
      outputFilePath: convert.getDistFilePath(path.join(root, '/pages/index/index.js')),
      importStylePath: '',
      depComponents: new Set(),
      imports: taroizeResult.imports,
    })

    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('处理js文件中以/开头的绝对路径', () => {
    const DEMO_ABSOLUTE = {
      '/pages/index/index.js': `
        const { add } = require('/add')
        Page({})
      `,
      '/pages/index/add.js':`
        function add(num1,num2){
          return num1 + num2
        }
        module.exports.add = add
      `
    }
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, DEMO_ABSOLUTE)

    param.script = `
      const { add } = require('/add')
      Page({})
    `
    param.path = path.join(root, '/pages/index/index')
    param.scriptPath = path.join(root, '/pages/index/index.js')
    param.wxml = ''
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: path.join(root,'/pages/index/index.js'),
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('处理js文件中非正常路径，比如 a/b',() => {
    const DEMO_ABSOLUTE = {
      '/pages/index/index.js': `
        const { add } = require('add')
        Page({})
      `,
      '/pages/index/add.js':`
        function add(num1,num2){
          return num1 + num2
        }
        module.exports.add = add
      `
    }
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, DEMO_ABSOLUTE)

    param.script = `
      const { add } = require('add')
      Page({})
    `
    param.path = path.join(root, '/pages/index/index')
    param.scriptPath = path.join(root, '/pages/index/index.js')
    param.wxml = ''
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: path.join(root,'/pages/index/index.js'),
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })
})
