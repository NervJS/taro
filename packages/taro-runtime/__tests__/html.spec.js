// import { Scaner } from '../src/html/scaner'
// import { parser } from '../src/html/oparser'
import { parser } from '../src/dom/html/parser'
describe('html', () => {
  test('tt', () => {
    const s = '<h1 style="color:red" class="fork">This is a Heading</h1>'
    // const tokens = new Scaner(s).scan()
    // debugger
    // const html = parser(tokens)

    parser(s)
  })
})
