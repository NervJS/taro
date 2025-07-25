import { parseCode } from '../src/utils'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const logFileMap = new Map()
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn((path, content):any => {
    logFileMap.set(path, content)
  })
}))

describe('utils.ts', () => {
  afterEach(() => {
    logFileMap.clear()
  })
  describe('@babel/parser', () => {
    let code = ''
    const scriptPath = ''
    test('jsx 插件支持 jsx 转换', () => {
      code = `
        var dropdown =
          <Dropdown>
            A dropdown list
            <Menu>
              <MenuItem>Do Something</MenuItem>
              <MenuItem>Do Something Fun!</MenuItem>
              <MenuItem>Do Something Else</MenuItem>
            </Menu>
          </Dropdown>;
        render(dropdown);
      `
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toMatchSnapshot()
    })

    test('flow 插件支持 flow 类型转换', () => {
      code = `
        // @flow
        function square(num: number): number {
          return num * num;
        }
        const result: number = square(5);
      `
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toMatchSnapshot()
    })

    test('decorators-legacy 插件支持装饰器转换', () => {
      code = `
        class MyClass {
          @decorator
          myMethod() {
            // 方法体
          }
        }
      `
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toMatchSnapshot()
    })

    test('optionalChainingAssign 插件支持链式赋值语法', () => {
      code = `x?.prop = 2;`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe('x?.prop = 2;')
    })

    test('sourcePhaseImports 插件支持导入语句放在顶部之外的地方', () => {
      code = `
        const name = options && options.name ? options.name : "Anonymous";
        import source x from "./x"
      `
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toMatchSnapshot()
    })

    test('throwExpressions 插件支持 throw 表达式', () => {
      code = `() => throw new Error("");`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe(`() => throw new Error("");`)
    })

    test('deferredImportEvaluation 插件支持延迟导入', () => {
      code = `import defer * as ns from "dep"`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe(`import defer * as ns from "dep";`)
    })

    test('exportDefaultFrom 插件支持使用 export default from 语法导入默认导出', () => {
      code = `export v from "mod"`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe('export v from "mod";')
    })
  })
})
