import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom, removeShadowData } from './utils'
import { prettyPrint } from 'html'

describe('event', () => {
  test('普通绑定', () => {
    const { template, ast } = transform({
      ...baseOptions,
      code: buildComponent(`
      return (
        <View onClick={this.handleClick} />
      )
      `, 'handleClick = () => ({})', `import { Custom } from './utils'`)
    })
    const instance = evalClass(ast)
    removeShadowData(instance.state)

    expect(instance.state).toEqual({})
    expect(template).toMatch(`bindtap="Index__handleClick"`)
    expect(template).toMatch(`data-component-path=\"{{$path}}\"`)
    expect(template).toMatch(`data-component-class="Index"`)
  })

  test('bind 绑定', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(`
      return (
        <View onClick={this.handleClick.bind(this)} />
      )
      `, 'handleClick = () => ({})', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)

    expect(instance.state).toEqual({})
    expect(template).toMatch(`bindtap="Index__handleClick"`)
    expect(template).toMatch(`data-component-path=\"{{$path}}\"`)
    expect(template).toMatch(`data-component-class="Index"`)
    expect(template).toMatch(`data-e-handleClick-so="this"`)
  })

  test('bind 绑定支持写数字', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(`
      return (
        <View onClick={this.handleClick.bind(this, 666)} />
      )
      `, 'handleClick = () => ({})', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(template).toMatch(`data-e-handleClick-a-a="{{666}}`)
  })

  test('bind 绑定支持写数字 2', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(`
      return (
        <View onClick={this.handleClick.bind(this, 666, 777)} />
      )
      `, 'handleClick = () => ({})', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(template).toMatch(`data-e-handleClick-a-a="{{666}}`)
    expect(template).toMatch(`data-e-handleClick-a-b="{{777}}`)
  })

  test('bind 绑定支持写字面量对象', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      code: buildComponent(`
      return (
        <View onClick={this.handleClick.bind(this, { a: 1 })} />
      )
      `, 'handleClick = () => ({})', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    removeShadowData(instance.state)
    expect(instance.state).toEqual({})
    expect(template).toMatch(`data-e-handleClick-a-a=\"{{{`)
    expect(template).toMatch(`a: 1`)
    expect(template).toMatch(`}}}\">`)
    // expect(template).toMatch(`data-e-handleClick-a-b="{{777}}`)
  })

})
