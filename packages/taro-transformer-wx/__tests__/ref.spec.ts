import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom, prettyPrint } from './utils'

describe('ref', () => {
  describe('正常使用', () => {
    test('字符串', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View ref='a' />
          )
        `)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      const refs = instance.$$refs
      expect(refs[0].type).toBe('dom')
      expect(refs[0].refName).toBe('a')
      expect(refs[0].fn).toBe(null)
      expect(template).toMatch(/<view id="[a-zA-Z]{5}"><\/view>/)
    })

    test('自定义组件', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <Custom ref='a' />
          )
        `)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      const refs = instance.$$refs
      expect(refs[0].type).toBe('component')
      expect(refs[0].refName).toBe('a')
      expect(refs[0].fn).toBe(null)
      expect(template).toMatch(/<custom id="[a-zA-Z]{5}" __triggerObserer=\"{{ _triggerObserer }}\"><\/custom>/)
    })

    test('字符串模板', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View ref={\`a\`} />
          )
        `)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      const refs = instance.$$refs
      expect(refs[0].type).toBe('dom')
      expect(refs[0].refName).toBe('a')
      expect(refs[0].fn).toBe(null)
      expect(template).toMatch(/<view id="[a-zA-Z]{5}"><\/view>/)
    })

    test('inline 函数', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View ref={() => this.ref = ''} />
          )
        `)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      const refs = instance.$$refs
      expect(refs[0].type).toBe('dom')
      expect(refs[0].refName).toBe('')
      refs[0].fn()
      expect(instance.ref).toBe('')
      expect(template).toMatch(/<view id="[a-zA-Z]{5}"><\/view>/)
    })

    test('函数', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View ref={this.mapView} />
          )
        `, `mapView = () => this.ref = ''`)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      const refs = instance.$$refs
      expect(refs[0].type).toBe('dom')
      expect(refs[0].refName).toBe('')
      refs[0].fn()
      expect(instance.ref).toBe('')
      expect(template).toMatch(/<view id="[a-zA-Z]{5}"><\/view>/)
    })
  })

  describe('loop', () => {
    test('内置组件', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = [{ list: [] }, { list: [] }]
          return (
            <View>{array.map((item, index) => {
              return <CoverView ref={(node) => this.coverView[index] = node}>{item.list.map(item2 => <Text>{item2}</Text>)}</CoverView>
            })}</View>
          )
        `, `coverView = []`)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      expect(instance.coverView).toEqual(['test-ref', 'test-ref'])
      expect(template).toMatch(`<cover-view id="{{`)
      expect(template).toMatch(` + index}}"`)
    })

    test('内置组件 + 其它复杂表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = [{ list: [] }, { list: [] }]
          return (
            <View>{array.map((item, index) => {
              return <CoverView style={item} ref={(node) => this.coverView[index] = node}>{item.list.map(item2 => <Text>{item2}</Text>)}</CoverView>
            })}</View>
          )
        `, `coverView = []`)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      expect(instance.coverView).toEqual(['test-ref', 'test-ref'])
    })

    test('自定义组件组件', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = [{ list: [] }, { list: [] }]
          return (
            <View>{array.map((item, index) => {
              return <Cover ref={(node) => this.coverView[index] = node}>{item.list.map(item2 => <Text>{item2}</Text>)}</Cover>
            })}</View>
          )
        `, `coverView = []`)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      expect(instance.coverView).toEqual(['test-component-ref', 'test-component-ref'])
      expect(template).toMatch(`<cover id="{{`)
      expect(template).toMatch(prettyPrint(`
      <block>
        <view>
            <cover id=\"{{item.$loopState__temp2}}\" __triggerObserer=\"{{ _triggerObserer }}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"item\" wx:for-index=\"index\">
                <text wx:for=\"{{item.$original.list}}\" wx:for-item=\"item2\">{{item2}}</text>
            </cover>
        </view>
    </block>
      `))
    })

    test('内置组件多重循环', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = [{ list: ['', ''] }, { list: [''] }]
          return (
            <View>{array.map((item, index) => {
              return <CoverView ref={(node) => this.coverView[index] = node}>
                {item.list.map((item2, idx) => <Text ref={(node) => this.text[index] = item.list}>{item2}</Text>)}
              </CoverView>
            })}</View>
          )
        `, `coverView = [];text = []`)
      })
      // console.log(instance)
      const instance = evalClass(ast)
      expect(instance.coverView).toEqual(['test-ref', 'test-ref'])
      expect(instance.text).toEqual([['', ''], ['']])
      expect(template).toMatch(`<cover-view id="{{`)
      expect(template).toMatch(` + index}}"`)
    })

  })
})
