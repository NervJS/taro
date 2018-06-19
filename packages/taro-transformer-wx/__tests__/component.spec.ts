import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom } from './utils'
import { isObject } from 'lodash'

describe('$props', () => {
  test('$props 一直存在并且是一个 Object', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(baseCode)
    })

    const instance = evalClass(ast)
    expect(isObject(instance.$props)).toBeTruthy()
  })

  test('$usedState 加入被引用第三方组件的名字', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(`
      const { list } = this.state
      return (
        <Custom />
      )
      `, '', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    expect(instance.$usedState.includes('$$Custom')).toBeTruthy()
  })

  // @TODO
  // 后悔没做 TDD
  test.skip('重复使用同一组件不会增加 $usedState', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(`
      const { list } = this.state
      return (
        <View>
          <Custom />
          <Custom />
        </View>
      )
      `, '', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    expect(instance.$usedState.length).toEqual(1)
  })
})

describe('$components', () => {
  test('$components 一直存在并且是一个 Object', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(baseCode)
    })

    const instance = evalClass(ast)
    expect(isObject(instance.$components)).toBeTruthy()
  })

  test('$components works', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(`
      const { list } = this.state
      return (
        <Custom />
      )
      `, '', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    expect(instance.$components.Custom).toEqual(Custom)
  })

  describe('component results', () => {
    test('component results', () => {
      const { ast, components } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { list } = this.state
        return (
          <Custom />
        )
        `, '', `import { Custom } from './utils'`)
      })

      const component = components[0]
      expect(components.length).toBe(1)
      expect(component.name).toBe('Custom')
      expect(component.path).toBe('./utils')
    })

    test('component results 重复不会添加', () => {
      const { ast, components } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { list } = this.state
        return (
          <View>
            <Custom />
            <Custom />
          </View>
        )
        `, '', `import { Custom } from './utils'`)
      })
      const component = components[0]
      expect(components.length).toBe(1)
      expect(component.name).toBe('Custom')
      expect(component.path).toBe('./utils')
    })

    test('component results 能在单层循环使用', () => {
      const { ast, components } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { list } = this.state
        return (
          <View>
            {list.map(item => <Custom />)}
          </View>
        )
        `, '', `import { Custom } from './utils'`)
      })
      const component = components[0]
      expect(components.length).toBe(1)
      expect(component.name).toBe('Custom')
      expect(component.path).toBe('./utils')
    })

    test('component results 能在多层循环使用', () => {
      const { components, code, template } = transform({
        ...baseOptions,
        code: buildComponent(`
          const { list } = this.state
          return (
            <View>
              {list.map(item => {
                return (
                  <View>
                    {item.children.map(child => <Custom />)}
                  </View>
                )
              })}
            </View>
          )
          `, '', `import { Custom } from './utils'`)
      })
      const component = components[0]
      expect(components.length).toBe(1)
      expect(component.name).toBe('Custom')
      expect(component.path).toBe('./utils')
    })
  })
  test.skip('重复使用同一组件不会增加 $components', () => {
    const { ast } = transform({
      ...baseOptions,
      code: buildComponent(`
        const { list } = this.state
        return (
          <View>
            <Custom />
            <Custom />
          </View>
        )
        `, '', `import { Custom } from './utils'`)
    })

    const instance = evalClass(ast)
    expect(Object.keys(instance.$components).length).toEqual(1)
  })
})
