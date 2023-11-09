import * as t from '@babel/types'

import { convertStyleUnit, parseContent, parseStyle, parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode } from './util'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

interface Option {
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  json?: string
  script?: string
  scriptPath?: string
  wxml?: string
  isApp?: boolean
}

const option: Option = {
  framework: 'react',
  json: '{}',
  path: '',
  rootPath: '',
  script: '',
  scriptPath: '',
  wxml: ''
}

describe('wxml语法', () => {
  test('当wxml 是 undefined', () => {
    option.wxml = undefined
    //  parseWXML会先获取缓存，所有每个用例的path需要保持其唯一性
    option.path = 'wxml_undefined'
    const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
    expect(wxml?.type).toBe('NullLiteral')
    expect(wxses).toEqual([])
    expect(imports).toEqual([])
    expect(Array.from(refIds)).toEqual(Array.from(new Set()))
  })

  test('wxml 简单应用', () => {
    option.wxml = `<view>Hello Word!</view>`
    //  parseWXML会先获取缓存，所有每个用例的path需要保持其唯一性
    option.path = 'wxml__'
    const { wxml } = parseWXML(option.path, option.wxml)
    // wxml转为ast
    expect(wxml).toBeTruthy()
    expect(wxml?.type).toBe('JSXElement')
  })

  test('wxml数据绑定', () => {
    option.wxml = `<view>{{data}}</view>`
    option.path = 'wxml_message'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('组件属性', () => {
    option.wxml = `<view id="item-{{id}}"> </view>`
    option.path = 'wxml_component_properties'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('关键字', () => {
    option.wxml = `<checkbox checked="{{checked}}"></checkbox>`
    option.path = 'wxml_keywords'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('三元运算', () => {
    option.wxml = `<view hidden="{{flag ? true : false}}"> Hidden </view>`
    option.path = 'wxml_ternary_operations'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('字符串运算', () => {
    option.wxml = `<view>{{"hello" + name}}</view>`
    option.path = 'wxml_string_operations'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('列表渲染', () => {
    option.wxml = `
      <view wx:for="{{array}}">
        {{index}}: {{item.message}}
      </view>
    `
    option.path = 'wxml_wx_for'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('wx:key="index"会转换成key="index"', () => {
    option.wxml = `<view wx:key="index" wx:for="{{data}}">
                    <text>{{item.name}}</text>
                  </view>`
    option.path = 'wxml_key'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('条件渲染', () => {
    option.wxml = `
      <view wx:if="{{length > 5}}"> 1 </view>
      <view wx:elif="{{length > 2}}"> 2 </view>
      <view wx:else> 3 </view>
    `
    option.path = 'wxml_if'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})

describe('slot插槽', () => {
  test('匿名插槽',() => {
    option.wxml = `
      <view>
        <slot-component>
          <view>插入slot的内容</view>
        </slot-component>
      </view>
    `
    option.path = 'anonymity_slot'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe('<View><SlotComponent><View>插入slot的内容</View></SlotComponent></View>')
  })

  test('具名插槽',() => {
    option.wxml = `
      <view>
        <slot-component>
          <view slot="before">这里是插入到组件slot name="before"中的内容</view>
          <view slot="after">这里是插入到组件slot name="after"中的内容</view>
        </slot-component>
      </view>
    `
    option.path = 'named_slot'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})

describe('wxs', () => {
  // 测试是否引入以及转换后生成的wxs在taro-cli-convertor中
  test('在页面中引入外部wxs', () => {
    /**
     const wxs = `
        var foo = "'hello world' from comm.wxs";
        var bar = function(d) {
          return d;
        }
        module.exports = {
          foo: foo,
          bar: bar
        };
      `
     */
    option.wxml = `
      <wxs src=".././../utils/test.wxs" module="wxs_test"/>
      <view>{{wxs_test.foo}}</view>
      <view>{{wxs_test.bar('nihao')}}</view>
    `
    option.path = 'wxs_src'
    const { wxml, wxses }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
    expect(wxses).toMatchSnapshot()
  })

  test('页面中使用wxs', () => {
    option.wxml = `<wxs module="wxs_demo">
                        module.exports = {
                            data: 'wxs demo'
                        }
                    </wxs>
                    <view>Hello Word!</view>
                    <view>{{wxs_demo.data}}</view>`
    //  parseWXML会先获取缓存，所有每个用例的path需要保持其唯一性
    option.path = 'wxml_wxs'
    const { wxml, wxses, imports }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxmlCode).toMatchSnapshot()
    expect(wxses).toMatchSnapshot()
    expect(importsCode).toMatchSnapshot()
  })

  test('wxs中 单行注释', () => {
    option.wxml = `
      <wxs module="wxs_test">
        module.exports = {
          foo: "'hello world' from tools.wxs",
          // msg:'123'
        };
      </wxs>
      <view>{{wxs_test.foo}}</view>
    `
    option.path = 'wxs_line_comments'
    const { imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(importsCode).toMatchSnapshot()
  })

  test('wxs 多行注释', () => {
    option.wxml = `
      <wxs module="wxs_test">
        module.exports = {
          foo: "'hello world' from tools.wxs",
          /*
            msg:'123',
            name:'xixi'
          */
        };
      </wxs>
      <view>{{wxs_test.foo}}</view>
    `
    option.path = 'wxs_multiple_comments'
    const { imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(importsCode).toMatchSnapshot()
  })

  test('wxs 结尾注释', () => {
    option.wxml = `
      <wxs module="wxs_test">
        module.exports = {
          foo: "'hello world' from tools.wxs",
      
        };
        /*
          var = msg:'123',
          var = name:'xixi'
      </wxs>
      <view>{{wxs_test.foo}}</view>
    `
    option.path = 'wxs_end_comments'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError()
  })

  test('wxs模块中的var regexp = getRegExp()转换为var regexp = new RegExp()', () => {
    option.wxml = `<wxs module="wxs_regexp">
                    var regexp = getRegExp()
                  </wxs>`
    option.path = 'wxml_wxs_regexp'
    const { wxses, imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxses).toMatchSnapshot()
    expect(importsCode).toMatchSnapshot()
  })

  test('wxs标签中的getDate()转换为new Date()', () => {
    option.wxml = `
      <wxs module="wxs_getDate">
        module.exports = {
          date1:getDate(),
          //参数为数字
          date2:getDate(1500000000000),
          //参数为字符串
          date3:getDate('2017-7-14') 
        }
      </wxs>
    `
    option.path = 'wxml_wxs_getDate'
    const { wxses, imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxses).toMatchSnapshot()
    expect(importsCode).toMatchSnapshot()
  })
})

describe('组件', () => {
  test('wxml中image的mode=""会转换成mode', () => {
    option.wxml = `<image class="img" src="{{imgSrc}}" mode=""></image>`
    option.path = 'wxml_mode'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})

describe('parseContent', () => {
  test('节点key的值解析', () => {
    const contentInput = `{{list}}`
    const { type, content } = parseContent(contentInput)
    expect(type).toBe('expression')
    expect(content).toBe(`(list)`)
  })
})

describe('style属性的解析', () => {
  // 第一种以style="xxx:xxx"的用法
  test('style = xxx:xxx', () => {
    let contentInput = 'color: red;background-color: aqua;'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(color: red;background-color: aqua;)')
    }
  })

  test('style = xxx:{{ xxx }}', () => {
    let contentInput = 'color: red;background-color: aqua;font-size: {{ fontSize }};'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(color: red;background-color: aqua;font-size: {{ fontSize }};)')
    }
  })

  test('style = xxx:{{ xxx }}px', () => {
    let contentInput = 'height: {{ height }}px;width: 100px;background-color: red;'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(height: {{ height }}px;width: 5rem;background-color: red;)')
    }
  })

  test('style = xxx:{{ xxx }}, 含有三元运算符', () => {
    let contentInput = 'height: {{ list.length > 10 ? 200 : 100 }}px;width: 100px;background-color: green;'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(height: {{ list.length > 10 ? 200 : 100 }}px;width: 100px;background-color: green);')
    }
  })

  test('style = xxx:{{ xxx + 10 }}px', () => {
    let contentInput = 'height: {{ height + 10 }}px;width: 100px;background-color: red;'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('({{ height + 10 }}px;width: 5rem;background-color: red;)')
    }
  })

  // style=xxx:xxx情况中属性值中的value既有变量也有变量拼字符串
  test('style = xxx:xxx变量与变量拼接混用', () => {
    let contentInput = 'height: {{ height }}px;width: {{ width }}px;background-color: {{ color }};'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(height: {{ height }}px;width: {{ width }}px;background-color: {{ color }})')
    }
  })

  // style=xxx:xxx情况中属性值中的value既有变量拼接也有三元表达式
  test('style = xxx:xxx变量拼接与三元表达式混用', () => {
    let contentInput = 'height: {{ height }}px;width: {{ width }}px;background-color: {{ false ? color : "blue" }};'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut.type).toEqual('JSXAttribute')
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(height: {{ height }}px;width: {{ width }}px;background-color: {{ false ? color : "blue" }};)')
    }
  })

  // 第二种以双括号用法
  test('style = {{ xxx }}变量形式', () => {
    let contentInput = '{{ myStyle }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(myStyle)')
    }
  })

  test('style = {{ xxx }}字符串形式', () => {
    let contentInput = "{{ 'height: 100px;width: 100px;background-color: red;' }}"
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe("('height: 5rem;width: 5rem;background-color: red;')")
    }
  })

  test('style = {{ xxx }}含三元运算符', () => {
    let contentInput = "{{ index > 1 ? 'height: 100px;width: 100px;background-color: green;' : '' }}"
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe("(index > 1 ? 'height: 5rem;width: 5rem;background-color: green;' : '')")
    }
  })

  test('style = {{ xxx }}含三元运算符和变量', () => {
    let contentInput = '{{ index ? "background-color: " + backgroundColor + ";" : "" }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(index ? "background-color: " + backgroundColor + ";" : "")')
    }
  })

  // 第三种xxx:xxx和{{ xxx }}混用情况
  // style属性值是xxx:xxx与{{ xxx }}混用
  test('xxx:xxx和{{ xxx }}混用情况1', () => {
    let contentInput = 'background-color: aqua;{{ global_css }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('"background-color: aqua;"+(global_css)')
    }
  })

  // style属性值是xxx:xxx与{{ 三元表达式 }}混用
  test('xxx:xxx和{{ xxx }}混用情况2', () => {
    let contentInput = 'background-color: aqua;{{ true ? global_css : "" }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('"background-color: aqua;"+(true ? global_css : "")')
    }
  })

  // style属性值是变量拼接字符串和{{ xxx }}混用
  test('xxx:xxx和{{ xxx }}混用情况3', () => {
    let contentInput = 'background-color: {{ color }};{{ global_css }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('"background-color: "+(color)+";"+(global_css)')
    }
  })

  // style属性值是三元表达式拼接字符串和{{ xxx }}混用
  test('xxx:xxx和{{ xxx }}混用情况4', () => {
    let contentInput = 'background-color: {{ true ? color : "" }};{{ global_css }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('"background-color: "+(true ? color : "")+";"+(global_css)')
    }
  })

  // style属性值是多个{{ xxx }}
  test('xxx:xxx和{{ xxx }}混用情况5', () => {
    let contentInput = '{{ global_css }}{{ myStyle }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(global_css)+(myStyle)')
    }
  })

  // 第四种情况, 虽然也是xxx:xxx形式但是key是一个变量
  test('style = xxx:xxx, 但是key是变量', () => {
    let contentInput = '{{ styleName }}: red;height: 100px;width: 100px;'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('(styleName)+": red;height: 5rem;width: 5rem;"')
    }
  })

  // style为空的特殊写法
  // style = { xxx }微信不规范写法
  test('style为空的特殊写法1', () => {
    let contentInput = '{styleX}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('raw')
      expect(content).toBe('{styleX}')
    }
  })

  // style = "", 属性值为空
  test('style为空的特殊写法2', () => {
    let contentInput = '""'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('raw')
      expect(content).toBe('""')
    }
  })

  // style = {{  }}, 属性值为空
  test('style为空的特殊写法3', () => {
    let contentInput = '{{}}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('raw')
      expect(content).toBe('{{}}')
    }
  })

  // style = {{ '' }}, 属性值为空
  test('style为空的特殊写法4', () => {
    let contentInput = '{{ "" }}'
    contentInput = convertStyleUnit(contentInput)
    const styleParseReslut = parseStyle('style', contentInput)
    if (t.isJSXAttribute(styleParseReslut)) {
      expect(styleParseReslut).toEqual(t.jSXAttribute)
    } else {
      const { type, content } = styleParseReslut
      expect(type).toBe('expression')
      expect(content).toBe('("")')
    }
  })

  test('px/rpx单位转换为rem', () => {
    let contentInput = 'width: 100px;height: 200rpx;padding: {{padCount}}px;margin: {{marCount}}rpx;'
    contentInput = convertStyleUnit(contentInput)
    expect(contentInput).toBe('width: 5rem;height: 5rem;padding: {{padCount/20}}rem;margin: {{marCount/40}}rem;')
  })

  test('0px/rpx转换为0rempx/rpx', () => {
    let contentInput = `<swiper-item style="transform: translate(0%, 0px) translateZ(0rpx);"></swiper-item>`
    contentInput = convertStyleUnit(contentInput)
    expect(contentInput).toBe(`<swiper-item style="transform: translate(0%, 0rem) translateZ(0rem);"></swiper-item>`)
  })

  test('style="height: calc(100vh - {{xxx}}rem)"，内联样式使用calc计算，包含变量，变量前有空格，转换后空格保留', () => {
    let contentInput = `<swiper-item style="height: calc(100vh - {{num}}rem);"></swiper-item>`
    contentInput = convertStyleUnit(contentInput)
    expect(contentInput).toBe('<swiper-item style="height: calc(100vh - {{num}}rem);"></swiper-item>')
  })
})

describe('wx作用域属性解析', () => {
  test('wx不支持的属性scope-data', () => {
    option.wxml = `<view wx:scope-data="{{...myData}}">
                      {{id}}
                    </view>`
    option.path = 'wx_unknown'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual('<View>{id}</View>')
  })

  test('wx:if', () => {
    option.wxml = `<view wx:if="{{xx}}">
                      {{xxx}}
                    </view>`
    option.path = 'wx_if'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`xx && <View>{xxx}</View>`)
  })

  test('wx:for', () => {
    option.wxml = `<view wx:for="{{list}}">
                      {{item}}
                    </view>`
    option.path = 'wx_for'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`list.map((item, index) => {\n  return <View>{item}</View>;\n})`)
  })

  test('wx:for & wx:for-xxx', () => {
    option.wxml = `<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
                      {{idx}}: {{itemName.message}}
                    </view>`
    option.path = 'wx_for_xxx'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('wx:if & wx:for', () => {
    option.wxml = `<view wx:if="{{item.key}}" wx:for="{{modalKey}}">
                      the value is : {{item.value}}
                    </view>`
    option.path = 'wx_if_for'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('wx:for & wx:if', () => {
    option.wxml = `<view wx:for="{{modalKey}}" wx:if="{{item.key}}">
                      the value is : {{item.value}}
                    </view>`
    option.path = 'wx_for_if'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})