import transform from '../src'
import { LOOP_STATE } from '../src/constant'
import { buildComponent, baseOptions, evalClass, removeShadowData } from './utils'

describe('loop', () => {
  describe('没有 block 包住', () => {
    describe('一层 loop', () => {
      test('简单情况', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <View>{item}</View>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)

        expect(template).toMatch(`<view wx:for="{{array}}" wx:for-item="item">{{item}}</view>`)
        expect(Object.keys(instance.state).length).toBe(1)
        expect(instance.state.array).toEqual(['test1', 'test2', 'test3'])
      })

      test('简单情况', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => {
                return <View>{\`\$\{item\}\`}</View>
              })}</View>
            )
          `)
        })

        // const instance = evalClass(ast)
        // removeShadowData(instance.state)

        // expect(template).toMatch(`<view wx:for="{{array}}" wx:for-item="item">{{item}}</view>`)
        // expect(Object.keys(instance.state).length).toBe(1)
        // expect(instance.state.array).toEqual(['test1', 'test2', 'test3'])
      })

      test('能使用 key', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <Custom key={item}>{item}</Custom>)}</View>
            )
          `, ``, `import { Custom } from './utils'`)
        })

        expect(template).toMatch(`wx:key="{{item}}"`)
      })

      test('能使用 key', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = [{id: 1}, {id: 2}, {id: 3}]
            return (
              <View>{array.map(item => <Custom key={item.id} />)}</View>
            )
          `, ``, `import { Custom } from './utils'`)
        })

        expect(template).toMatch(`wx:key="{{item.id}}"`)
      })

      test('callee 支持复杂表达式', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.slice(0, 1).map(item => <View>{item}</View>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        const stateName = Object.keys(instance.state)[0]

        expect(template).toMatch(`<view wx:for="{{${stateName}}}" wx:for-item="item">{{item}}</view>`)
        expect(Object.keys(instance.state).length).toBe(1)
        expect(instance.state[stateName]).toEqual(['test1'])
      })

      test('callee 支持复杂表达式', () => {
        const { template, ast, code } = transform({
          ...baseOptions,
          isRoot: true,
          code: buildComponent(`
            const array = ['test1', 'test2', 'test3']
            return (
              <View>{array.map(item => <View>{escape(item)}</View>)}</View>
            )
          `)
        })

        const instance = evalClass(ast)
        removeShadowData(instance.state)
        // const stateName = Object.keys(instance.state)[0]

        expect(template).toMatch(`<view wx:for="{{loopArray0}}" wx:for-item="item">{{item.$loopState`)
        expect(instance.state.loopArray0.some(a => {
          for (const key in a) {
            if (key.startsWith(LOOP_STATE)) {
              return true
            }
          }
          return false
        })).toBeTruthy()
        // expect(Object.keys(instance.state).length).toBe(1)
        // expect(instance.state[stateName]).toEqual(['test1'])
      })
    })
  })
})
