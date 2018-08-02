import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass, Custom } from './utils'
import { isObject } from 'lodash'

describe('components', () => {
  test('components 一直存在并且是一个数组', () => {
    const { components } = transform({
      ...baseOptions,
      code: buildComponent(baseCode)
    })

    expect(Array.isArray(components)).toBeTruthy()
  })

  test('$components works', () => {
    const { components } = transform({
      ...baseOptions,
      code: buildComponent(`
      const { list } = this.state
      return (
        <Custom />
      )
      `, '', `import { Custom } from './utils'`)
    })

    expect(components[0].name).toEqual('custom')
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
      expect(component.name).toBe('custom')
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
      expect(component.name).toBe('custom')
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
      expect(component.name).toBe('custom')
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
      expect(component.name).toBe('custom')
      expect(component.path).toBe('./utils')
    })
  })
  test('重复使用同一组件不会增加 $components', () => {
    const { components } = transform({
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
    expect(component.name).toBe('custom')
    expect(component.path).toBe('./utils')
  })
})
