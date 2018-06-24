import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom, removeShadowData } from './utils'

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

  test('普通绑定', () => {
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
    expect(template).toMatch(`data-event-handleClick-scope="this"`)
  })
})
