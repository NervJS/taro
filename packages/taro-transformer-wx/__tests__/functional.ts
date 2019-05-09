import transform from '../src'
import { buildComponent, baseOptions, evalClass, prettyPrint } from './utils'

type headerArray = {}[]

const a: {}[] = []

a.push([])

describe('类函数式组件', () => {
  describe('不传参', () => {
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
            <Custom data='s'>abc</Custom>
          )
        }`)
      })
      const inst = evalClass(ast)
      expect(inst.state.hasOwnProperty('anonymousState__temp')).toBeTruthy()

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
      <block>
          <custom compid=\"{{$compid__0}}\">abc</custom>
      </block>
  </template>
  <block>
      <view>
          <template is=\"renderTest\" data=\"{{...anonymousState__temp}}\"></template>
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
      expect(inst.state.hasOwnProperty('anonymousState__temp')).toBeTruthy()

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
      <block>
          <view>abc</view>
      </block>
  </template>
  <block>
      <view>
          <template is=\"renderTest\" data=\"{{...anonymousState__temp}}\"></template>
      </view>
  </block>
      `))
    })

    test('循环', () => {
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
      expect(inst.state.hasOwnProperty('anonymousState__temp')).toBeTruthy()
      expect(inst.state.hasOwnProperty('loopArray0')).toBeTruthy()

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
      <block>
          <view>abc</view>
      </block>
  </template>
  <block>
      <view>
          <block wx:for=\"{{loopArray0}}\" wx:for-item=\"i\">
              <template is=\"renderTest\" data=\"{{...i.$loopState__temp3}}\"></template>
          </block>
      </view>
  </block>
      `))
    })

    test('在循环中直接 return', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const test = this.renderTest()
          return (
            <View>{this.state.tasks.map(i => this.renderTest())}</View>
          )
        `, `state = { tasks: [] }; renderTest () {
          return (
            <View>abc</View>
          )
        }`)
      })

      const inst = evalClass(ast)
      expect(inst.state.hasOwnProperty('anonymousState__temp')).toBeTruthy()
      expect(inst.state.hasOwnProperty('loopArray0')).toBeTruthy()

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
      <block>
          <view>abc</view>
      </block>
  </template>
  <block>
      <view>
          <template is=\"renderTest\" data=\"{{...i.$loopState__temp3}}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"i\"></template>
      </view>
  </block>
      `))
    })
  })

  describe('传参', () => {

    test('简单情况', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const array = [{ list: [] }]
          return (
            <View>{this.renderTest([])}</View>
          )
        `, `state = { tasks: [] }; renderTest (p) {
          return (
            <View>{p}</View>
          )
        }`)
      })

      const inst = evalClass(ast)
      expect(inst.state.anonymousState__temp).toEqual({ p: [] })
      expect(template).toMatch(prettyPrint(`
      <template name="renderTest">
          <block>
              <view>{{p}}</view>
          </block>
      </template>
      <block>
          <view>
              <template is="renderTest" data="{{...anonymousState__temp}}"></template>
          </view>
      </block>
      `))
    })

    test('命名为变量', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const test = this.renderTest([])
          return (
            <View>{test}</View>
          )
        `, `state = { tasks: [] }; renderTest (p) {
          return (
            <View>{p}</View>
          )
        }`)
      })

      const inst = evalClass(ast)
      expect(inst.state.anonymousState__temp).toEqual({ p: [] })

      expect(template).toMatch(prettyPrint(`
      <template name="renderTest">
          <block>
              <view>{{p}}</view>
          </block>
      </template>
      <block>
          <view>
              <template is="renderTest" data="{{...anonymousState__temp}}"></template>
          </view>
      </block>
      `))
    })

    test('循环', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          return (
            <View>{this.state.tasks.map(i => {
              return <Block>{this.renderTest([])}</Block>
            })}</View>
          )
        `, `state = { tasks: [] }; renderTest (p) {
          return (
            <View>{p}</View>
          )
        }`)
      })

      const inst = evalClass(ast)
      expect(inst.state).toEqual({ tasks: [], loopArray0: [] })

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
      <block>
          <view>{{p}}</view>
      </block>
  </template>
  <block>
      <view>
          <block wx:for=\"{{loopArray0}}\" wx:for-item=\"i\">
              <template is=\"renderTest\" data=\"{{...i.$loopState__temp2}}\"></template>
          </block>
      </view>
  </block>
      `))
    })

    test('在循环中直接 return', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const test = this.renderTest()
          return (
            <View>{this.state.tasks.map(i => this.renderTest())}</View>
          )
        `, `state = { tasks: [] }; renderTest () {
          return (
            <View>abc</View>
          )
        }`)
      })

      const inst = evalClass(ast)
      expect(inst.state.hasOwnProperty('anonymousState__temp')).toBeTruthy()
      expect(inst.state.hasOwnProperty('loopArray0')).toBeTruthy()

      expect(template).toMatch(prettyPrint(`
      <template name=\"renderTest\">
          <block>
              <view>abc</view>
          </block>
      </template>
      <block>
          <view>
              <template is=\"renderTest\" data=\"{{...i.$loopState__temp3}}\" wx:for=\"{{loopArray0}}\" wx:for-item=\"i\"></template>
          </view>
      </block>
      `))
    })
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

describe('闭包函数表达式', () => {
  test('basic', () => {
    const { template, ast,code } = transform({
      ...baseOptions,
      isRoot: true,
      code: `const Test = (a) => {
        const renderTest = () => {
          return <View />
        }

        return (
          <View className='page-body'>
            {renderTest()}
          </View>
        )
      }`
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view class=\"page-body\">
            <template is=\"renderClosureTest\" data=\"{{...anonymousState__temp}}\"></template>
        </view>
    </block>
    <template name=\"renderClosureTest\">
        <block>
            <view></view>
        </block>
    </template>
    `))
  })

  test('basic2', () => {
    const { template, ast,code } = transform({
      ...baseOptions,
      isRoot: true,
      code: `function Test() {
        const renderTest = () => {
          return <View />
        }

        return (
          <View className='page-body'>
            {renderTest()}
          </View>
        )
      }`
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view class=\"page-body\">
            <template is=\"renderClosureTest\" data=\"{{...anonymousState__temp}}\"></template>
        </view>
    </block>
    <template name=\"renderClosureTest\">
        <block>
            <view></view>
        </block>
    </template>
    `))
  })

  test('basic3', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const renderTest = () => {
        return <View />
      }

      return (
        <View className='page-body'>
          {renderTest()}
        </View>
      )
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view class=\"page-body\">
            <template is=\"renderClosureTest\" data=\"{{...anonymousState__temp}}\"></template>
        </view>
    </block>
    <template name=\"renderClosureTest\">
        <block>
            <view></view>
        </block>
    </template>
    `))
  })

  test('可以接受多个参数', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const renderTest = (a, b) => {
        return <View a={a} b={b} />
      }

      return (
        <View className='page-body'>
          {renderTest()}
        </View>
      )
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view class=\"page-body\">
            <template is=\"renderClosureTest\" data=\"{{...anonymousState__temp}}\"></template>
        </view>
    </block>
    <template name=\"renderClosureTest\">
        <block>
            <view a="{{a}}" b="{{b}}"></view>
        </block>
    </template>
    `))
  })

  test('闭包使用函数声明', () => {
    expect(() => {
      transform({
        ...baseOptions,
        isRoot: true,
        code: `function Test() {
          function renderTest() {
            return <View />
          }

          return (
            <View className='page-body'>
              {renderTest()}
            </View>
          )
        }`
      })
    }).toThrowError(/如果是在函数内声明闭包组件，则需要使用函数表达式的写法/)
  })

  test('闭包使用函数声明2', () => {
    expect(() => {
      transform({
        ...baseOptions,
        isRoot: true,
        code: `
        function Test() {
          function renderTest() {
            return <View />
          }

          return (
            <View className='page-body'>
              {renderTest()}
            </View>
          )
        }
        `
      })
    }).toThrowError(/如果是在函数内声明闭包组件，则需要使用函数表达式的写法/)
  })

  test.skip('闭包使用函数声明3', () => {
    expect(() => {
      transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        function renderTest () {
          return <View />
        }

        return (
          <View className='page-body'>
            {renderTest()}
          </View>
        )
        `)
      })
    }).toThrowError(/如果是在函数内声明闭包组件，则需要使用函数表达式的写法/)
  })
})
