import transform from '../src'
import { buildComponent, baseOptions, evalClass } from './utils'

describe('Template', () => {

  test('暂不支持 JSX 成员表达式', () => {
    expect(() => {
      transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <View.A />
        `)
      })
    }).toThrow()
  })

  describe('使用 [] 获取成员表达式', () => {
    test('可以直接使用 this.state ', () => {
      const { template, ast } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View>{this.state.list[this.state.index]}</View>
          )
        `, `state = {
          list:['a','b','c'],
          index:0
          }`)
      })
      expect(template).toMatch('anonymousState__temp')

      const instance = evalClass(ast)
      expect(instance.state.anonymousState__temp).toBe('a')
    })

    test('可以使用 props ', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View>{this.state.list[this.props.index]}</View>
          )
        `, `state = {
          list:['a','b','c'],
          index:0
          }`)
      })

      expect(template).toMatch('anonymousState__temp')
    })

    test('使用标识符', () => {
      const { template, code, ast } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { list, index } = this.state
          return (
            <View>{list[index]}</View>
          )
        `, `state = {
          list:['a','b','c'],
          index:0
          }; static defaultProps = { index: 0 }`)
      })

      const instance = evalClass(ast)
      expect(template).not.toMatch('anonymousState__temp')
      expect(instance.$usedState).toEqual(['list', 'index'])

    })
  })

  test('不支持 spread 表达式', () => {
    expect(() => {
      transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <View {...this.props.a} />
        `)
      })
    }).toThrow()
  })

  describe('大小写', () => {
    test('单驼峰内置组件', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <View />
        `)
      })

      expect(template).toMatch('<view></view>')
    })

    test('双驼峰内置组件', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <ScrollView />
        `)
      })

      expect(template).toMatch('<scroll-view></scroll-view>')
    })

    test('className 变为 class', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <ScrollView className='a' />
        `)
      })

      expect(template).toMatch('<scroll-view class="a"></scroll-view>')
    })

    test('expression 有多个 this.props.xx 成员表达式', () => {
      const { template, code, ast } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <ScrollView className={this.props.iconList && this.props.iconList.length > 3 ? 'iconlist_wrap' : 'iconlist_wrap wrap-less'} />
        `)
      })

      const instance = evalClass(ast)

      expect(instance.$usedState).toEqual([ 'iconList' ])

      expect(template).toMatch(`<scroll-view class=\"{{iconList && iconList.length > 3 ? 'iconlist_wrap' : 'iconlist_wrap wrap-less'}}\"></scroll-view>`)
    })

    describe('props 为布尔值', () => {
      test('内置组件', () => {
        const { template } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <ScrollView hidden />
          `)
        })

        expect(template).toMatch('<scroll-view hidden="{{true}}"></scroll-view>')
      })

      test('直接写值', () => {
        const { template } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <ScrollView hidden={true} />
          `)
        })

        expect(template).toMatch('<scroll-view hidden="{{true}}"></scroll-view>')
      })

      test('内置组件 + 特殊 props', () => {
        const { template } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <ScrollView scrollX />
          `)
        })

        expect(template).toMatch('<scroll-view scroll-x="{{true}}"></scroll-view>')
      })

      test('内置组件 + 特殊 props + 直接写值', () => {
        const { template } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <ScrollView scrollX={true} />
          `)
        })

        expect(template).toMatch('<scroll-view scroll-x="{{true}}"></scroll-view>')
      })

      test('内置组件 2', () => {
        const { template } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <View hidden />
          `)
        })

        expect(template).toMatch('<view hidden="{{true}}"></view>')
      })

      test('自定义组件', () => {
        const { template, code, ast } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            return <Custom hidden />
          `, ``, `import { Custom } from './utils'`)
        })

        const instance = evalClass(ast)
        const props = instance.$props.Custom()
        expect(props.$name).toBe('Custom')
        expect(props.hidden).toBe(true)
        expect(template).toMatch(`<template is="Custom" data="{{...$$Custom}}"></template>`)
      })
    })

    test('驼峰式应该变为下划线式', () => {
      const { template, ast } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return <View hoverClass='test' />
        `)
      })

      expect(template).toMatch('<view hover-class="test"></view>')
    })

    // test('本来是下划线不用再转', () => {
    //   const { template } = transform({
    //     ...baseOptions,
    //     isRoot: true,
    //     code: buildComponent(`
    //      return <View className='index'>
    //       { [0, 1, 2, 3].map(i => <Text key={i}>{ i }</Text>) }
    //     </View>
    //     `)
    //   })

    //   // expect(template).toMatch('<view data-id="1"></view>')
    // })
  })
})
