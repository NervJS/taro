import { parseCode } from '../src/utils'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('utils.ts', () => {
  describe('@babel/parser', () => {
    let code = ''
    const scriptPath = ''
    test('jsx插件支持jsx转换', () => {
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

    test('flow插件支持flow类型转换',() => {
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

    test('decorators-legacy插件支持装饰器转换',() => {
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

    test('optionalChainingAssign插件支持链式赋值语法',() => {
      code = `x?.prop = 2;`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe('x?.prop = 2;')
    })
    
    test('sourcePhaseImports插件支持导入语句放在顶部之外的地方',() => {
      code = `
        const name = options && options.name ? options.name : "Anonymous";
        import source x from "./x"
      `
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toMatchSnapshot()
    })

    test('throwExpressions插件支持throw表达式',() => {
      code = `() => throw new Error("");`
      const ast = parseCode(code, scriptPath)
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe(`() => throw new Error("");`)
    })

    test('deferredImportEvaluation插件支持延迟导入',() => {
      code = `import defer * as ns from "dep"`
      const ast = parseCode(code, scriptPath) 
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe(`import * as ns from "dep";`)
    })

    test('exportDefaultFrom插件支持使用 export default from 语法导入默认导出',() => {
      code = `export v from "mod"`
      const ast = parseCode(code, scriptPath) 
      const codeStr = generateMinimalEscapeCode(ast)
      expect(codeStr).toBe('export v from "mod";')
    })
  })
})
