import * as t from '@babel/types'

import { parse } from '../src'
import { convertStyleUnit, parseContent, parseStyle, parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

const option: any = {
  framework: 'react',
  json: '{}',
  logFilePath: '',
  path: '',
  rootPath: '',
  script: '',
  scriptPath: '',
  wxml: '',
  isApp: false,
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
    expect(wxmlCode).toBe('<View>{data}</View>')
  })

  test('组件属性值为字符串', () => {
    option.wxml = `<view id="item-view1"> </view>`
    option.path = 'wxml_component_properties_string'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View id="item-view1"></View>`)
  })

  test('组件属性值为变量', () => {
    option.wxml = `<view id="item-{{id}}"> </view>`
    option.path = 'wxml_component_properties_variable'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View id={"item-" + id}></View>`)
  })

  test('属性值为关键字(需要在双引号之内)', () => {
    // false关键字为 boolean
    option.wxml = `<checkbox checked="{{false}}"></checkbox>`
    option.path = 'wxml_keywords'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe('<Checkbox checked={false}></Checkbox>')
  })

  test('属性值为三元运算', () => {
    option.wxml = `<view hidden="{{flag ? true : false}}"> Hidden </view>`
    option.path = 'wxml_ternary_operations'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe('!(flag ? true : false) && <View>Hidden</View>')
  })

  test('渲染数据为字符串和变量拼接', () => {
    option.wxml = `<view>{{"hello" + name}}</view>`
    option.path = 'wxml_string_operations'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View>{"hello" + name}</View>`)
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
    expect(wxmlCode).toBe(
      `length > 5 ? <View>1</View> : length > 2 ? <View>2</View> : <View>3</View>`
    )
  })
  
  test('使用wx:if替换wx:show属性', () => {
    option.wxml = `<view wx:show="{{isShow}}">
                    测试使用wx:if替换wx:show属性
                  </view>`
    option.path = 'wxml_show'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})

describe('slot插槽', () => {
  test('匿名插槽', () => {
    /**
     * 插槽模板
     */
    option.wxml = `
      <view class="wrapper">
        <view>这里是组件的内部节点</view>
        <slot></slot>
      </view>
    `
    option.path = `anonymity_slot`
    const { wxml: slotWxml }: any = parseWXML(option.path, option.wxml)
    const slotWxmlCode = generateMinimalEscapeCode(slotWxml)
    expect(slotWxmlCode).toBe(`<View className="wrapper"><View>这里是组件的内部节点</View>{this.props.children}</View>`)

    /**
     * wxml页面内容
     * 检测插槽组件是否引入需在 taro-cli-convertor 中
     */
    option.wxml = `
      <view>
        <slot-component>
          <view>插入slot的内容</view>
        </slot-component>
      </view>
    `
    option.path = 'anonymity_wxml_slot'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe('<View><SlotComponent><View>插入slot的内容</View></SlotComponent></View>')
  })

  test('具名插槽', () => {
    /**
     * 插槽模板
     */
    option.wxml = `
      <view class="wrapper">
        <slot name="before"></slot>
        <view>这里是组件的内部细节</view>
        <slot name="after"></slot>
      </view>
    `
    option.path = 'named_slot'
    const { wxml: slotWxml }: any = parseWXML(option.path, option.wxml)
    const slotWxmlCode = generateMinimalEscapeCode(slotWxml)
    expect(slotWxmlCode).toBe(
      `<View className="wrapper">{this.props.renderBefore}<View>这里是组件的内部细节</View>{this.props.renderAfter}</View>`
    )

    /**
     * wxml页面内容
     * 检测插槽组件是否引入需在 taro-cli-convertor 中
     */
    option.wxml = `
      <view>
        <slot-component>
          <view slot="before">这里是插入到组件slot name="before"中的内容</view>
          <view slot="after">这里是插入到组件slot name="after"中的内容</view>
        </slot-component>
      </view>
    `
    option.path = 'named_wxml_slot'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View><SlotComponent renderBefore={<Block><View>这里是插入到组件slot name="before"中的内容</View></Block>} renderAfter={<Block><View>这里是插入到组件slot name="after"中的内容</View></Block>}></SlotComponent></View>`)
  })

  test('当元素设置slot属性且值为空串时，移除slot属性', () => {
    option.wxml = `
      <view>
        <slot-component>
          <view slot="">这里是插入到组件slot name="before"中的内容</view>
          <view slot="after">这里是插入到组件slot name="after"中的内容</view>
        </slot-component>
      </view>
    `
    option.path = 'component_slot_empty'
    const { wxml: slotWxml }: any = parseWXML(option.path, option.wxml)
    const slotWxmlCode = generateMinimalEscapeCode(slotWxml)
    expect(slotWxmlCode).toMatchSnapshot()
  })

  test('slot的值为非字符串', () => {
    option.wxml = `
      <view class="wrapper">
        <slot name="{{123}}"></slot>
        <view>这里是组件的内部细节</view>
        <slot name="after"></slot>
      </view>
    `
    option.path = 'slot_name_no_string'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError()
  })
})

describe('wxs', () => {
  /**
   *  关于外部wxs文件的转换在taro-cli-convertor包中
   */
  test('在页面中引入外部wxs，转换情况', () => {
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
    option.script = 'Page({})'
    const { ast }: any = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  test('页面中使用wxs', () => {
    option.wxml = `
      <wxs module="wxs_demo">
        module.exports = {
          data: 'wxs demo'
        }
      </wxs>
      <view>Hello Word!</view>
      <view>{{wxs_demo.data}}</view>
    `
    //  parseWXML会先获取缓存，所有每个用例的path需要保持其唯一性
    option.path = 'wxml_wxs'
    const { wxml, wxses, imports }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxmlCode).toBe('<Block><View>Hello Word!</View><View>{wxs_demo.data}</View></Block>')
    expect(wxses[0]).toEqual({ module: 'wxs_demo',src: './wxs__wxs_demo' })
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

  test('wxs 标签的属性值为空', () => {
    option.wxml = `<wxs src="" module=""/>`
    option.path = 'wxs_empty'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('wxs 标签的属性值不得为空')
  })

  test('wxs 没有src属性且内部无代码', () => {
    option.wxml = `<wxs module="wxs_no_code"></wxs>`
    option.path = 'wxs_no_code'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('wxs 如果没有 src 属性，标签内部必须有 wxs 代码。')
  })

  test('wxs模块中的var regexp = getRegExp()转换为var regexp = new RegExp()', () => {
    option.wxml = `
      <wxs module="wxs_regexp">
        var regexp = getRegExp()
      </wxs>
    `
    option.path = 'wxml_wxs_regexp'
    const { wxses, imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxses[0]).toEqual({ module: 'wxs_regexp',src: './wxs__wxs_regexp' })
    expect(importsCode).toBe('var regexp = new RegExp();')
  })

  test('getRegExp()只有一个参数', () => {
    // 参数为变量
    option.wxml = `
      <wxs module="wxs_getRegExp">
        module.exports = {
          regFun: function(date){
            return getRegExp(date)
          }
        }
      </wxs>
      <view>{{wxs_getRegExp.regFun('x')}}</view>
    `
    option.path = 'wxs_getRegExp_argument_variable'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('getRegExp 函数暂不支持传入变量类型的参数')

    // 参数为非字符串
    option.wxml = `
      <wxs module="wxs_getRegExp">
        module.exports = {
          reg : getRegExp(123)
        }
      </wxs>
      <view>{{wxs_getRegExp.reg}}</view>
    `
    option.path = 'wxs_getRegExp_argument_no_string'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('getRegExp 函数暂不支持传入非字符串类型的参数')
  })

  test('getRegExp()有两个参数', () => {
    // 参数为变量
    option.wxml = `
      <wxs module="wxs_getRegExp">
        module.exports = {
          regFun: function(date,flag){
            return getRegExp(date,flag)
          }
        }
      </wxs>
      <view>{{wxs_getRegExp.regFun('x','img')}}</view>
    `
    option.path = 'wxs_getRegExp_arguments_variable'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('getRegExp 函数暂不支持传入变量类型的参数')

    // 参数为非字符串
    option.wxml = `
      <wxs module="wxs_getRegExp">
        module.exports = {
          reg : getRegExp(123,'img')
        }
      </wxs>
      <view>{{wxs_getRegExp.reg}}</view>
    `
    option.path = 'wxs_getRegExp_arguments_no_string'
    expect(() => parseWXML(option.path, option.wxml)).toThrowError('getRegExp 函数暂不支持传入非字符串类型的参数')
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
    expect(wxses[0]).toEqual({ module: 'wxs_getDate',src: './wxs__wxs_getDate' })
    expect(importsCode).toMatchSnapshot()
  })
})

describe('解析wxs中创建正则表达式方法的转换', () => {

  test('定义了正则表达式的修饰符,则使用自定义修饰符', () => {
    option.wxml = `
    <wxs module="xxxfile">
      var a = getRegExp('jzy123','img')
      module.exports = {
        reg: a
      }
    </wxs>
    `
    option.path = 'wxml_wxs_reg1'
    const { wxses, imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxses[0]).toEqual({ module: 'xxxfile',src: './wxs__xxxfile' })
    expect(importsCode).toMatchSnapshot()
  })

  test('没有定义了正则表达式的修饰符,就不添加修饰符使用默认', () => {
    option.wxml = `
    <wxs module="xxxfile">
      var a = getRegExp('jzy123')
      module.exports = {
        reg: a
      }
    </wxs>
    `
    option.path = 'wxml_wxs_reg2'
    const { wxses, imports }: any = parseWXML(option.path, option.wxml)
    const importsCode = generateMinimalEscapeCode(imports[0].ast)
    expect(wxses[0]).toEqual({ module: 'xxxfile',src: './wxs__xxxfile' })
    expect(importsCode).toMatchSnapshot()
  })
})

describe('组件', () => {
  test('wxml中image的mode=""会转换成mode', () => {
    option.wxml = `<image class="img" src="{{imgSrc}}" mode=""></image>`
    option.path = 'wxml_mode'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<Image className="img" src={imgSrc} mode="scaleToFill"></Image>`)
  })

  test('组件属性 data-XXX，XXX转为小写', () => {
    option.wxml = `<view data-ID="123">组件属性data标识</view>`
    option.path = 'data_id'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View data-id="123">组件属性data标识</View>`)
  })
})

describe('parseContent', () => {
  test('节点key的值解析', () => {
    const contentInput = '{{list}}'
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

  test('style = xxx:{{ xxx + 10 }}rpx', () => {
    const contentInput = '<view style="font-size: {{height + 10}}rpx;">style参数为变量</view>'
    const contentOut = convertStyleUnit(contentInput)
    expect(contentOut).toBe(`<view style="font-size: {{(height + 10)/40}}rem;">style参数为变量</view>`)
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
      expect(content).toBe(
        '(height: {{ height }}px;width: {{ width }}px;background-color: {{ false ? color : "blue" }};)'
      )
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

  test('绝对值小于1的px/rpx转换成rem', () => {
    let contentInput = `<swiper-item style="margin-left: 0.5px;margin-right: -0.5rpx;"></swiper-item>`
    contentInput = convertStyleUnit(contentInput)
    expect(contentInput).toBe(`<swiper-item style="margin-left: 0.025rem;margin-right: -0.0125rem;"></swiper-item>`)
  })

  test('style="height: calc(100vh - {{xxx}}rem)"，内联样式使用calc计算，包含变量，变量前有空格，转换后空格保留', () => {
    let contentInput = `<swiper-item style="height: calc(100vh - {{num}}rem);"></swiper-item>`
    contentInput = convertStyleUnit(contentInput)
    expect(contentInput).toBe('<swiper-item style="height: calc(100vh - {{num}}rem);"></swiper-item>')
  })

  test('当设置 style 属性但未赋值则删除该属性', () => {
    option.wxml = `<view style="">style为空</view>`
    option.path = 'component_style_empty'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toBe(`<View>style为空</View>`)
  })
})

describe('wx作用域属性解析', () => {
  test('wx不支持的属性scope-data', () => {
    option.wxml = `
      <view wx:scope-data="{{...myData}}">
        {{id}}
      </view>
    `
    option.path = 'wx_unknown'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual('<View>{id}</View>')
  })

  test('wx:if', () => {
    option.wxml = `
      <view wx:if="{{xx}}">
        {{xxx}}
      </view>
    `
    option.path = 'wx_if'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`xx && <View>{xxx}</View>`)
  })

  test('wx:for', () => {
    option.wxml = `
      <view wx:for="{{list}}">
        {{item}}
      </view>
    `
    option.path = 'wx_for'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`list.map((item, index) => {\n  return <View>{item}</View>;\n})`)
  })

  test('wx:for & wx:for-xxx', () => {
    option.wxml = `
      <view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
        {{idx}}: {{itemName.message}}
      </view>
    `
    option.path = 'wx_for_xxx'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('wx:if & wx:for', () => {
    option.wxml = `
      <view wx:if="{{item.key}}" wx:for="{{modalKey}}">
        the value is : {{item.value}}
      </view>
    `
    option.path = 'wx_if_for'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })

  test('wx:for & wx:if', () => {
    option.wxml = `
      <view wx:for="{{modalKey}}" wx:if="{{item.key}}">
        the value is : {{item.value}}
      </view>
    `
    option.path = 'wx_for_if'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toMatchSnapshot()
  })
})

describe('hidden属性解析', () => {
  test('一般组件的hidden属性解析', () => {
    option.wxml = `<view hidden="{{xx}}">{{xxx}}</view>`
    option.path = 'hidden'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`!xx && <View>{xxx}</View>`)
  })

  test('template的hidden属性解析', () => {
    option.wxml = `<template is="{{name}}" hidden="{{xx}}" />`
    option.path = 'hidden_template'
    const { wxml }: any = parseWXML(option.path, option.wxml)
    const wxmlCode = generateMinimalEscapeCode(wxml)
    expect(wxmlCode).toEqual(`!xx && <Template is={name}></Template>`)
  })
})