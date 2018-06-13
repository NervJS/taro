import transform from '../src'
import { buildComponent, baseOptions } from './utils'

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
    test('可以直接使用', () => {
      const { template, code } = transform({
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
      console.log(code)
      expect(template).toMatch('anonymousState__temp')
    })

    test('', () => {
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

    test('驼峰式应该变为下划线式', () => {
      const { template } = transform({
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
