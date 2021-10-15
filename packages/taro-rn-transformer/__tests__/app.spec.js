import * as path from 'path'
import * as transformer from '../dist/index'

const App = `class HomeScreen extends React.Component {
  render () {
    return this.porps.children
  }
}`

function run () {
  const options = {
    projectRoot: path.resolve(__dirname),
    isEntryFile: () => { return true },
    nextTransformer: ({ src }) => { return src }
  }
  const code = transformer.transform({ src: App, filename: './src/app', options })
  return code
}

describe('app-loader', () => {
  it('app', () => {
    const result = run()
    expect(result).toMatchSnapshot()
  })
})
