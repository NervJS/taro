import transform from '../src'
import { buildComponent, baseCode, baseOptions } from './utils'
import { INTERNAL_SAFE_GET, DEFAULT_Component_SET } from '../src/constant'
import generate from 'babel-generator'

describe('基本功能', () => {
  test('导出包', () => {
    expect(transform).not.toBe(undefined)
  })

  describe('基本转换', () => {
    const { code, ast, template } = transform({
      ...baseOptions,
      code: buildComponent(baseCode)
    })

    test('转换结果不为空', () => {
      expect(code).not.toBeFalsy()
      expect(ast).not.toBeFalsy()
      expect(template).not.toBeFalsy()
    })

    test('render() 方法会被去除', () => {
      expect(code.includes('render()')).toBeFalsy()
      expect(code.includes('render ()')).toBeFalsy()
    })

    test('_createdData() 方法会一直存在', () => {
      expect(code.includes('_createdData()')).toBeFalsy()
    })
  })

  describe('支持 TypeScript', () => {
    test('tsx', () => {
      expect(() => transform({
        ...baseOptions,
        code: buildComponent(`
          const a: string = '';
        ` + baseCode),
        isTyped: true,
        sourcePath: 'a.tsx'
      })).not.toThrow()
    })

    test('ts', () => {
      const { ast } = transform({
        ...baseOptions,
        code: `
          const responseHandler = <Output>({ data }: Taro.request.Promised<any>): Output => {
            if (data.success) {
              return data.content;
            } else {
            }
          };
        `,
        isTyped: true,
        isNormal: true
      })

      expect(() => generate(ast)).not.toThrow()
    })
  })

  test('支持 Flow ', () => {
    expect(() => transform({
      ...baseOptions,
      code: buildComponent(`
      function concat(a: string, b: string) {
        return a + b;
      }
      ` + baseCode)
    })).not.toThrow()
  })

  test.skip('支持 async/await', () => {
    const { code } = transform({
      ...baseOptions,
      code: buildComponent(baseCode, `
        async f () {
          await ''
        }
      `)
    })

    expect(
      code.trim().startsWith(`import "@tarojs/async-await";`)
    ).toBeTruthy()
  })

  test('支持 Redux Provider', () => {
    const { code, template } = transform({
      ...baseOptions,
      code: buildComponent(
        `
        return (
          <Provider store={test}>
            <View />
          </Provider>
        )`,
        '',
        `import { Provider, connect } from '@tarojs/redux';
        const test = {};`
      )
    })

    expect(template.includes('Provider')).toBeFalsy()
    expect(code.includes('setStore(test);')).toBeTruthy()
  })

  test('导入 internal 方法', () => {
    const { code } = transform({
      ...baseOptions,
      code: buildComponent(baseCode)
    })

    expect(code.includes(INTERNAL_SAFE_GET)).toBeTruthy()
  })

  test('isApp 为 true 时只返回 ast', () => {
    const { code, ast, template } = transform({
      ...baseOptions,
      isApp: true,
      code: buildComponent(baseCode)
    })

    expect(ast).not.toBeUndefined()
    expect(code).toBeUndefined()
    expect(template).toBeUndefined()
  })
})
