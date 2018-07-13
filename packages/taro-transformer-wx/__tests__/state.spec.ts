import transform from '../src'
import { buildComponent, baseCode, baseOptions, evalClass } from './utils'

function removeShadowData (obj: Object) {
  if (obj['__data']) {
    delete obj['__data']
  }
  return obj
}

describe('State', () => {
  describe('使用 object pattern 从 this 取 state', () => {
    test('只有一个 pattern', () => {
      const { ast, code } = transform({
        ...baseOptions,
        code: buildComponent(`
          const { state } = this
          return (
            <View className={'icon-' + this.props.type}>测试 + {this.props.type}</View>
          )
        `, `state = { type: 'test' }`)
      })

      const instance = evalClass(ast)
      expect(instance.__state.type).toBe('test')
      expect(instance.state.type).toBe('test')
      expect(code).not.toMatch('const { state } = this')
      expect(code).toMatch(`const state = this.__state`)
    })

    test('可以使用 state 关键字作为 state', () => {
      const { ast, code, template } = transform({
        ...baseOptions,
        code: buildComponent(`
          const { state } = this.state.task
          return (
            <View>{state}</View>
          )
        `, `state = { task: { state: null } }`)
      })

      const instance = evalClass(ast)
      expect(instance.state.state).toBe(null)
      expect(instance.$usedState.includes('state')).toBe(true)
    })

    test('可以使用 props 关键字作为 state', () => {
      const { ast, code, template } = transform({
        ...baseOptions,
        code: buildComponent(`
          const { props } = this.state.task
          return (
            <View>{state}</View>
          )
        `, `state = { task: { props: null } }`)
      })

      const instance = evalClass(ast)
      expect(instance.state.props).toBe(null)
      expect(instance.$usedState.includes('props')).toBe(true)
    })

    test('可以使用 style', () => {
      const { template } = transform({
        ...baseOptions,
        code: buildComponent(
          `
          return (
            <View style={'width:' + this.state.rate + 'px;'}>
              <View />
            </View>
          )`,
          `state = { rate: 5 }`
        )
      })

      expect(template).toMatch(`<view style="{{'width:' + rate + 'px;'}}">`)
    })

    test('可以使用 template style', () => {
      const { template, ast } = transform({
        ...baseOptions,
        code: buildComponent(
          `
          const rate = 5;
          return (
            <View style={\`width: \$\{rate\}px;\`}>
              <View />
            </View>
          )`
        )
      })

      const instance = evalClass(ast)

      expect(instance.state.anonymousState__temp).toBe(`width: 5px;`)
      expect(template).toMatch(`<view style="{{anonymousState__temp}}">`)
    })

    test('多个 pattern', () => {
      const { ast, code } = transform({
        ...baseOptions,
        code: buildComponent(`
          const { state, props } = this
          return (
            <View className={'icon-' + this.props.type}>测试 + {this.props.type}</View>
          )
        `, `state = { type: 'test' }`)
      })

      const instance = evalClass(ast)
      expect(instance.__state.type).toBe('test')
      expect(instance.state.type).toBe('test')
      expect(code).not.toMatch('const { state } = this')
      expect(code).toMatch(`const { props } = this`)
      expect(code).toMatch(`const state = this.__state`)
    })

  })

  describe('$usedState', () => {
    test('$usedState 一直存在并且是一个 array', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(baseCode)
      })

      const instance = evalClass(ast)
      expect(Array.isArray(instance.$usedState)).toBeTruthy()
    })

    test('没有被定义也会被加上', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`return <View />`)
      })

      const instance = evalClass(ast)
      expect(Array.isArray(instance.$usedState)).toBeTruthy()
    })

    test('直接从 this.state 可以引用', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(baseCode)
      })

      const instance = evalClass(ast)
      expect(instance.$usedState[0]).toBe('list')
    })
  })

  describe('createData()', () => {
    test('没有定义即便使用也不会存在', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`return <View />`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({})
    })

    test('可以从 this.state 中使用', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(baseCode, `state = { list: [] }`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({ list: [] })
    })

    test('可以从 变量定义中 中使用', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`
        const list = this.state.list
        return (
          <View className='index'>
            <View className='title'>{this.state.title}</View>
            <View className='content'>
              {list.map(item => {
                return (
                  <View className='item'>{item}</View>
                )
              })}
              <Button className='add' onClick={this.add}>添加</Button>
            </View>
          </View>
        )
        `, `state = { list: [] }`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({ list: [] })
    })

    test('可以从 Object pattern 定义中使用', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { list } = this.state
        return (
          <View className='index'>
            <View className='title'>{this.state.title}</View>
            <View className='content'>
              {list.map(item => {
                return (
                  <View className='item'>{item}</View>
                )
              })}
              <Button className='add' onClick={this.add}>添加</Button>
            </View>
          </View>
        )
        `, `state = { list: [] }`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({ list: [] })
    })

    test('map 的 callee 也需要加入 state', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { list } = this.state
        const ary = list.filter(Boolean)
        return (
          <View className='index'>
            <View className='title'>{this.state.title}</View>
            <View className='content'>
              {ary.map(item => {
                return (
                  <View className='item'>{item}</View>
                )
              })}
              <Button className='add' onClick={this.add}>添加</Button>
            </View>
          </View>
        )
        `, `state = { list: [] }`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({ list: [], ary: [] })
    })

    test('成员表达式的 map callee 也需要加入 state', () => {
      const { ast } = transform({
        ...baseOptions,
        code: buildComponent(`
        const { obj } = this.state
        const ary = obj.list
        return (
          <View className='index'>
            <View className='title'>{this.state.title}</View>
            <View className='content'>
              {ary.map(item => {
                return (
                  <View className='item'>{item}</View>
                )
              })}
              <Button className='add' onClick={this.add}>添加</Button>
            </View>
          </View>
        )
        `, `state = { obj: { list: [] } }`)
      })

      const instance = evalClass(ast)
      expect(
        removeShadowData(instance._createData())
      ).toEqual({ obj: { list: [] }, ary: [] })
    })

    describe('自定义组件', () => {
      describe('Identifier', () => {
        test('逻辑表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              return <Custom test={a && b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true, b: '' })
        })

        test('条件表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              const c = ''
              return <Custom test={a ? b : c} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true, b: '', c: '' })
        })

        test('作用域有值', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              return <Custom test={a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true })
        })

        test('作用域有值但没用到', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              const c = ''
              return <Custom test={a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true })
        })
      })

      describe('JSXAttribute', () => {
        test('支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              return <Custom test={a.a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: { a: '' } })
        })

        test('三元表达式支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              const c = { c: '' }
              return <Custom test={a.a ? b.b : c.c} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' }, 'c': { 'c': '' } })
        })

        test('逻辑表达式支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              return <Custom test={a.a && b.b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' } })
        })

        test('逻辑表达式支持成员表达式 2', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              return <Custom test={a.a || b.b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' } })
        })
      })
    })

    describe('自定义组件', () => {
      describe('Identifier', () => {
        test('逻辑表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              return <View test={a && b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true, b: '' })
        })

        test('条件表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              const c = ''
              return <View test={a ? b : c} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true, b: '', c: '' })
        })

        test('作用域有值', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              return <Custom test={a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true })
        })

        test('作用域有值但没用到', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = true
              const b = ''
              const c = ''
              return <View test={a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: true })
        })
      })

      describe('JSXAttribute', () => {
        test('支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              return <View test={a.a} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ a: { a: '' } })
        })

        test('三元表达式支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              const c = { c: '' }
              return <View test={a.a ? b.b : c.c} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' }, 'c': { 'c': '' } })
        })

        test('逻辑表达式支持成员表达式', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              return <View test={a.a && b.b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' } })
        })

        test('逻辑表达式支持成员表达式 2', () => {
          const { ast } = transform({
            ...baseOptions,
            code: buildComponent(`
              const a = { a: '' }
              const b = { b: '' }
              return <View test={a.a || b.b} />
            `)
          })

          const instance = evalClass(ast)
          expect(
            removeShadowData(instance._createData())
          ).toEqual({ 'a': { 'a': '' }, 'b': { 'b': '' } })
        })
      })
    })
  })
})
