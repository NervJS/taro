// import { Scaner } from '../src/html/scaner'
// import { parser } from '../src/html/oparser'
import { parser } from '../src/dom/html/parser'
describe('html', () => {
  test('should not throw', () => {
    const s = '<h1 style="color:red" class="富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善">This is a Heading</h1>'
    expect(() => {
      parser(s)
    }).not.toThrow()
  })
})
