import transform from '../src'
import { buildComponent, baseOptions, evalClass, prettyPrint } from './utils'

describe('类函数式组件', () => {
  test('简单情况', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
        const array = [{ list: [] }]
        return (
          <View>{this.renderTest()}</View>
        )
      `, `state = { tasks: [] }; renderTest () {
        return (
          <View>abc</View>
        )
      }`)
    })

    const inst = evalClass(ast)
    expect(inst.state.anonymousState__temp2).toEqual({})
    expect(inst.$usedState.includes('anonymousState__temp2')).toBe(true)

    expect(template).toMatch(prettyPrint(`
    <template name="renderTest">
        <block>
            <view>abc</view>
        </block>
    </template>
    <block>
        <view>
            <template is="renderTest" data="{{...anonymousState__temp2}}"></template>
        </view>
    </block>
    `))
  })

  test('命名为变量', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
        const test = this.renderTest()
        return (
          <View>{test}</View>
        )
      `, `state = { tasks: [] }; renderTest () {
        return (
          <View>abc</View>
        )
      }`)
    })

    const inst = evalClass(ast)
    expect(inst.state.anonymousState__temp).toEqual({})
    expect(inst.$usedState.includes('anonymousState__temp')).toBe(true)

    expect(template).toMatch(prettyPrint(`
    <template name="renderTest">
        <block>
            <view>abc</view>
        </block>
    </template>
    <block>
        <view>
            <template is="renderTest" data="{{...anonymousState__temp}}"></template>
        </view>
    </block>
    `))
  })

  test.skip('在循环中直接 return', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
        const test = this.renderTest()
        return (
          <View>{this.state.tasks.map(i => {
            return <Block>{this.renderTest()}</Block>
          })}</View>
        )
      `, `state = { tasks: [] }; renderTest () {
        return (
          <View>abc</View>
        )
      }`)
    })

    const inst = evalClass(ast)
    // console.log(code)
    // console.log(template)
    expect(inst.state.anonymousState__temp).toEqual({})
    expect(inst.$usedState.includes('anonymousState__temp')).toBe(true)

    expect(template).toMatch(prettyPrint(`
    <template name="renderTest">
        <block>
            <view>abc</view>
        </block>
    </template>
    <block>
        <view>
            <template is="renderTest" data="{{...anonymousState__temp}}"></template>
        </view>
    </block>
    `))
  })
})

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
