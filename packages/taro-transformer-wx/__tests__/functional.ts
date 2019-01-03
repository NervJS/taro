import transform from '../src'
import { buildComponent, baseOptions, evalClass, prettyPrint } from './utils'

describe('函数式组件', () => {
  describe('函数声明', () => {
    test('无参数传入', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `function Test () {
          const tasks = []
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      const inst = evalClass(ast)
      expect(inst.state.tasks).toEqual([])
      expect(inst.$usedState).toEqual(['tasks'])

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入一个参数', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `function Test (props) {
          const { tasks } = props
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入对象解构参数', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `function Test ({ tasks }) {
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入数组解构参数', () => {
      expect(() => {
        transform({
          ...baseOptions,
          isRoot: true,
          code: `function Test ([a]) {
            if (tasks !== null) {
              return <View className='page-body' >
              </View>
            }

            return (
              <View className='page-body'>
                <Text>Hello world!</Text>
              </View>
            )
          }`
        })
      }).toThrowError(/函数式组件只支持传入一个简单标识符或使用对象结构/)
    })

    test('传入多个参数', () => {
      expect(() => {
        transform({
          ...baseOptions,
          isRoot: true,
          code: `function Test (a, b) {
            if (tasks !== null) {
              return <View className='page-body' >
              </View>
            }

            return (
              <View className='page-body'>
                <Text>Hello world!</Text>
              </View>
            )
          }`
        })
      }).toThrowError(/函数式组件的参数最多只能传入一个/)
    })
  })

  describe('函数表达式', () => {
    test('无参数传入', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `const Test = () => {
          const tasks = []
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      const inst = evalClass(ast)
      expect(inst.state.tasks).toEqual([])
      expect(inst.$usedState).toEqual(['tasks'])

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入一个参数', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `const Test = (props) => {
          const { tasks } = props
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入对象解构参数', () => {
      const { template, ast,code } = transform({
        ...baseOptions,
        isRoot: true,
        code: `const Test = ({ tasks }) => {
          if (tasks !== null) {
            return <View className='page-body' >
            </View>
          }

          return (
            <View className='page-body'>
              <Text>Hello world!</Text>
            </View>
          )
        }`
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <block wx:if=\"{{tasks !== null}}\">
                <view class=\"page-body\"></view>
            </block>
            <view class=\"page-body\" wx:else>
                <text>Hello world!</text>
            </view>
        </block>
      `))
    })

    test('传入数组解构参数', () => {
      expect(() => {
        transform({
          ...baseOptions,
          isRoot: true,
          code: `const Test = ([a]) => {
            if (tasks !== null) {
              return <View className='page-body' >
              </View>
            }

            return (
              <View className='page-body'>
                <Text>Hello world!</Text>
              </View>
            )
          }`
        })
      }).toThrowError(/函数式组件只支持传入一个简单标识符或使用对象结构/)
    })

    test('传入多个参数', () => {
      expect(() => {
        transform({
          ...baseOptions,
          isRoot: true,
          code: `const Test = (a, b) => {
            if (tasks !== null) {
              return <View className='page-body' >
              </View>
            }

            return (
              <View className='page-body'>
                <Text>Hello world!</Text>
              </View>
            )
          }`
        })
      }).toThrowError(/函数式组件的参数最多只能传入一个/)
    })
  })
})
