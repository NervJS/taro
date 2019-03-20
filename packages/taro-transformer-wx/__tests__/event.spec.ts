import transform from '../src'
import {
  buildComponent,
  baseCode,
  baseOptions,
  evalClass,
  Custom,
  removeShadowData,
  prettyPrint
} from './utils'

describe('event', () => {
  test('普通绑定', () => {
    const { template, ast } = transform({
      ...baseOptions,
      code: buildComponent(
        `
      return (
        <View onClick={this.handleClick} />
      )
      `,
        'handleClick = () => ({})',
        `import { Custom } from './utils'`
      )
    })
    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(instance.$$events).toEqual(['handleClick'])
    expect(template).toMatch(`bindtap="handleClick"`)
  })

  test('bind 绑定', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(
        `
      return (
        <View onClick={this.handleClick.bind(this)} />
      )
      `,
        'handleClick = () => ({})',
        `import { Custom } from './utils'`
      )
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)

    expect(instance.state).toEqual({})
    expect(template).toMatch(`bindtap="handleClick"`)
    expect(instance.$$events).toEqual(['handleClick'])
    expect(template).toMatch(`data-e-tap-so="this"`)
  })

  test('bind 绑定支持写数字', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(
        `
      return (
        <View onClick={this.handleClick.bind(this, 666)} />
      )
      `,
        'handleClick = () => ({})',
        `import { Custom } from './utils'`
      )
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(instance.$$events).toEqual(['handleClick'])
    expect(template).toMatch(`data-e-tap-a-a="{{666}}`)
  })

  test('bind 绑定支持写数字 2', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(
        `
      return (
        <View onClick={this.handleClick.bind(this, 666, 777)} />
      )
      `,
        'handleClick = () => ({})',
        `import { Custom } from './utils'`
      )
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(instance.$$events).toEqual(['handleClick'])
    expect(template).toMatch(`data-e-tap-a-a="{{666}}`)
    expect(template).toMatch(`data-e-tap-a-b="{{777}}`)
  })

  test('bind 绑定支持写字面量对象', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(
        `
      return (
        <View onClick={this.handleClick.bind(this, { a: 1 })} />
      )
      `,
        'handleClick = () => ({})',
        `import { Custom } from './utils'`
      )
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({ anonymousState__temp: { a: 1 } })
    expect(instance.$$events).toEqual(['handleClick'])
    expect(template).toMatch(
      `data-e-tap-a-a=\"{{anonymousState__temp}}`
    )
    // expect(template).toMatch(`data-e-handleClick-a-b="{{777}}`)
  })

  describe('this.props.func', () => {
    test('简单情况', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        code: buildComponent(
          `
        return (
          <View onClick={this.props.handleClick} />
        )
        `,
          'handleClick = () => ({})',
          `import { Custom } from './utils'`
        )
      })

      const instance = evalClass(ast)

      expect(template).toMatch(`<view bindtap="funPrivate1"></view>`)
      expect(instance.$$events).toEqual(['funPrivate1'])
    })

    test('相同的事件', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        code: buildComponent(
          `
        return (
          <View>
            <Text onClick={this.props.handleClick} />
            <Text onClick={this.props.handleClick} />
          </View>
        )
        `,
          'handleClick = () => ({})',
          `import { Custom } from './utils'`
        )
      })

      const instance = evalClass(ast)

      expect(template).toMatch(
        prettyPrint(`
      <block>
          <view>
              <text bindtap=\"funPrivate2\"></text>
              <text bindtap=\"funPrivate2\"></text>
          </view>
      </block>
      `)
      )
      expect(instance.$$events).toEqual(['funPrivate2'])
    })
  })

  describe('bind 函数参数含有复杂表达式, c95c8b27868cb7d7aa7c2ff10617876679b38086', () => {
    test('正常使用', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        code: buildComponent(
          `
        return (
          <View onClick={this.handleClick.bind(this, escape('test'))} />
        )
      `,
          'handleClick = () => ({})',
          `import { Custom } from './utils'`
        )
      })

      const instance = evalClass(ast)

      expect(Object.keys(instance.state).length).toBe(1)
      expect(instance.state.anonymousState__temp).toBe('test')
    })

    test('循环中有复杂表达式', () => {
      expect(() => {
        transform({
          ...baseOptions,
          code: buildComponent(
            `
        return (
          [].map(() => {
            return <View onClick={this.handleClick.bind(this, escape('test'))} />
          })
        )
      `,
            'handleClick = () => ({})',
            `import { Custom } from './utils'`
          )
        })
      }).toThrowError(
        /在循环中使用 bind 时，需要声明将此复杂表达式声明为一个变量再放入 bind 参数中。/
      )
    })
  })
})
