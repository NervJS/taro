// import { Scaner } from '../src/html/scaner'
// import { parser } from '../src/html/oparser'
import { parser } from '../src/html/parser'
describe('html', () => {
  test('tt', () => {
    const s = `
    <body>

    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
    
    </body>   
    `
    // const tokens = new Scaner(s).scan()
    // debugger
    // const html = parser(tokens)

    parser(s)
  })
})
