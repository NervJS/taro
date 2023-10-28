import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'

describe('parseAst', () => {
  test('当使用e.target.dataset时引入工具函数 getTarget', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    /**
     * json：index.json的内容
     * path：index的根目录（文件路径)
     * rootPath：小程序的根目录（文件路径）
     * script：index.js的内容
     * scriptPath：index.js的绝对路径
     * wxml：index.html的内容
     */
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:`
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
      `,
      scriptPath:'',
      wxml:`
        <view>测试data-xxx-xxx写法</view>
        <button data-tag-name="WX1314" data-tag-data="{{ tagInfo }}" bindtap="getMsg">获取</button>
        <view>测试data-xxxXxxx 驼峰写法</view>
        <button data-tagName="WX1314" data-tagData="{{ tagInfo }}" bindtap="getMsg02">获取</button>
        `
    }
    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    const convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })
    /**
     * sourceFilePath：需要转换的文件路径
     * outputFilePath：转换输出路径
     * importStylePath：style的文件路径
     */
    const { ast } = convert.parseAst({
      ast:taroizeResult.ast,
      sourceFilePath:'',
      outputFilePath:'',
      importStylePath:'',
      depComponents: new Set(),
      imports:[]
    })
    expect(ast).toMatchSnapshot()
  })
})