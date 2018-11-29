import transform from '../src'
import { buildComponent, baseOptions, evalClass, prettyPrint } from './utils'

describe('if statement', () => {
  test('简单情况', () => {
    const { template, ast,code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
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
      `)
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

  test('两个平级的 ifStatement', () => {
    const { template, ast } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const tasks = []
      if (tasks !== null) {
        return <View className='page-body' >
        </View>
      }

      if (tasks.length === 0) {
        return <View className='page-body'>
          <Text>{tasks.length}</Text>
        </View>
      }

      return (
        <View className='page-body'>
          <Text>Hello world!</Text>
        </View>
      )
      `)
    })

    expect(template).toMatch(prettyPrint(`
      <block>
          <block wx:if=\"{{tasks !== null}}\">
              <view class=\"page-body\"></view>
          </block>
          <block wx:elif=\"{{tasks.length === 0}}\">
              <view class=\"page-body\">
                  <text>{{tasks.length}}</text>
              </view>
          </block>
          <view class=\"page-body\" wx:else>
              <text>Hello world!</text>
          </view>
      </block>
    `))
  })

  test('if 的 test 含有复杂表达式', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const tasks = []
      if (JSON.stringify(tasks) !== '[]') {
        return <View className='page-body' >
        </View>
      }
      `)
    })

    const inst = evalClass(ast)
    expect(inst.state.anonymousState__temp).toBe(false)
    expect(template).toMatch(prettyPrint(`
    <block>
        <block wx:if=\"{{anonymousState__temp}}\">
            <view class=\"page-body\"></view>
        </block>
    </block>
    `))
  })

  test('if 的 block 含有复杂表达式', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const tasks = []
      if (true) {
        return <View className={JSON.stringify(tasks)} >
        </View>
      }
      `)
    })

    expect(template).toMatch(prettyPrint(`
      <block>
          <block wx:if="{{true}}">
              <view class="{{_$anonymousState__temp}}"></view>
          </block>
      </block>
    `))

    const inst = evalClass(ast)
    expect(inst.state._$anonymousState__temp).toEqual('[]')
    expect(Object.keys(inst.state).length).toBe(1)
  })

  test.skip('if-else', () => {
    const { template, ast } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      const tasks = []
      const content = null
      if (tasks !== null) {
        content = <View className='page-body' >
        </View>
      }

      if (tasks.length === 0) {
        content = <View className='page-body'>
          <Text>{tasks.length}</Text>
        </View>
      }

      return (
        <View className='page-body'>
          {content}
        </View>
      )
      `)
    })

    expect(template).toMatch(prettyPrint(`
      <block>
          <block wx:if=\"{{tasks !== null}}\">
              <view class=\"page-body\"></view>
          </block>
          <block wx:elif=\"{{tasks.length === 0}}\">
              <view class=\"page-body\">
                  <text>{{tasks.length}}</text>
              </view>
          </block>
          <view class=\"page-body\" wx:else>
              <text>Hello world!</text>
          </view>
      </block>
    `))
  })
})

describe('三元表达式', () => {

  describe('consequet 为 JSX', () => {

    test('alternate 为空字符串', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : '' }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block wx:if="{{title}}">
                    <text>yes</text>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为字符串', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : 'no' }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if=\"{{title}}\">
                        <text>yes</text>
                    </block>
                    <block wx:else>{{'no'}}</block>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为 null', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : null }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block wx:if="{{title}}">
                    <text>yes</text>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为 undefied', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : undefined }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block wx:if="{{title}}">
                    <text>yes</text>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为 数字', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : 123 }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if=\"{{title}}\">
                        <text>yes</text>
                    </block>
                    <block wx:else>{{123}}</block>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为 数字 0', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : 0 }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block wx:if="{{title}}">
                    <text>yes</text>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为变量', () => {
      const { template } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title, test } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : test }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if=\"{{title}}\">
                        <text>yes</text>
                    </block>
                    <block wx:else>{{test}}</block>
                </block>
            </view>
        </block>
      `))
    })

    test('alternate 为函数', () => {
      const { template, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
          const { title, test } = this.props
          return (
            <View>
              { title ? <Text>yes</Text> : escape(test) }
            </View>
          )
        `)
      })

      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if=\"{{title}}\">
                        <text>yes</text>
                    </block>
                    <block wx:else>{{anonymousState__temp}}</block>
                </block>
            </view>
        </block>
      `))
    })

  })
})

describe('inline 表达式', () => {
  describe('work with this.props.children', () => {
    test('|| 逻辑表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const text = 'test'
        return (
          <View>
            {text || this.props.children}
          </View>
        )
        `)
      })
      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if="{{text}}">{{text}}</block>
                    <block wx:else>
                        <slot></slot>
                    </block>
                </block>
            </view>
        </block>
      `))
    })

    test('三元表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const text = 'test'
        return (
          <View>
            {text ? text : this.props.children}
          </View>
        )
        `)
      })
      expect(template).toMatch(prettyPrint(`
        <block>
            <view>
                <block>
                    <block wx:if="{{text}}">{{text}}</block>
                    <block wx:else>
                        <slot></slot>
                    </block>
                </block>
            </view>
        </block>
      `))
    })

    test('逻辑非表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const text = 'test'
        return (
          <View>
            {!text && this.props.children}
          </View>
        )
        `)
      })
      expect(template).toMatch(prettyPrint(`
      <block>
          <view>
              <block wx:if=\"{{!text}}\">
                  <slot></slot>
              </block>
          </view>
      </block>
      `))
    })

    test('逻辑非表达式 2', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const text = 'test'
        return (
          <View>
            {!text && <Btn />}
          </View>
        )
        `, '', `import Btn from './btn'`)
      })
      expect(template).toMatch(prettyPrint(`
      <block>
          <view>
              <block wx:if=\"{{!text}}\">
                <btn __triggerObserer=\"{{ _triggerObserer }}\"></btn>
              </block>
          </view>
      </block>
      `))
    })
  })
  describe('匿名 state 生成也需要带上表达式条件', () => {
    test('三元表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const tasks = []
        return (
          tasks && tasks.length ? <View className={String('page')}>
            <Text>Hello world!</Text>
          </View> : null
        )
        `)
      })

      const inst = evalClass(ast)
      expect(inst.state.anonymousState__temp).toBe(null) // 默认设置为 null
    })

    test('逻辑表达式', () => {
      const { template, ast, code } = transform({
        ...baseOptions,
        isRoot: true,
        code: buildComponent(`
        const tasks = []
        return (
          tasks && tasks.length && <View className={String('Page')}>
            <Text>Hello world!</Text>
          </View>
        )
        `)
      })

      const inst = evalClass(ast)
      expect(inst.state.anonymousState__temp).toBe(null) // 默认设置为 null
    })
  })
})

describe('switch case', () => {
  test('switch 嵌套 if', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      switch (this.props.testType) {
        case type.direct: {
          if (type.d2) {
            body = (<View>1</View>)
          }
          break;
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
    <view>
        <block wx:if=\"{{testType === type.direct}}\">
            <block wx:if=\"{{type.d2}}\">
                <view>1</view>
            </block>
        </block>
    </view>
</block>
    `))
  })

  test('if 嵌套 switch', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      if (type.d2) {
        switch (this.props.testType) {
          case type.direct: {
            body = (<View>1</View>)
            break;
          }
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
    <view>
        <block wx:if=\"{{type.d2}}\">
            <block wx:if=\"{{testType === type.direct}}\">
                <view>1</view>
            </block>
        </block>
    </view>
</block>
    `))
  })

  test('只有一个 case', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      switch (this.props.testType) {
        case type.direct: {
          body = (<View>1</View>)
          break;
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view>
            <block>
                <block wx:if="{{testType === type.direct}}">
                    <view>1</view>
                </block>
            </block>
        </view>
    </block>
    `))
  })

  test('多个 case', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      switch (this.props.testType) {
        case type.direct: {
          body = (<View>1</View>)
          break;
        }
        case type.d2: {
          body = (<View>2</View>)
          break;
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view>
            <block>
                <block wx:if="{{testType === type.direct}}">
                    <view>1</view>
                </block>
                <block wx:elif="{{testType === type.d2}}">
                    <view>2</view>
                </block>
            </block>
        </view>
    </block>
    `))
  })

  test('有 default case', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      switch (this.props.testType) {
        case type.direct: {
          body = (<View>1</View>)
          break;
        }
        case type.d2: {
          body = (<View>2</View>)
          break;
        }
        default: {
          body = (<View>default</View>)
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    expect(template).toMatch(prettyPrint(`
    <block>
        <view>
            <block>
                <block wx:if="{{testType === type.direct}}">
                    <view>1</view>
                </block>
                <block wx:elif="{{testType === type.d2}}">
                    <view>2</view>
                </block>
                <view wx:else>default</view>
            </block>
        </view>
    </block>
    `))
  })

  test('case 的语句也需要执行', () => {
    const { template, ast, code } = transform({
      ...baseOptions,
      isRoot: true,
      code: buildComponent(`
      let body;
      const type = {}
      switch (type) {
        case this.props.direct: {
          body = (<View>1</View>)
          break;
        }
        case this.props.d2: {
          body = (<View>2</View>)
          break;
        }
        default: {
          this.test = ''
          body = (<View>default</View>)
        }
      }
      return (
        <View>
          {body}
        </View>
      );
      `)
    })

    const instance = evalClass(ast)
    expect(instance.test).toBe('')

    expect(template).toMatch(prettyPrint(`
    <block>
        <view>
            <block>
                <block wx:if=\"{{type === direct}}\">
                    <view>1</view>
                </block>
                <block wx:elif=\"{{type === d2}}\">
                    <view>2</view>
                </block>
                <view wx:else>default</view>
            </block>
        </view>
    </block>
    `))
  })
})
