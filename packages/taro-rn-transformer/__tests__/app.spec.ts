import * as path from 'path'

import { transform } from '../src/index'

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
  const code = transform({ src: App, filename: './src/app', options })
  return code
}

describe('app-loader', () => {
  it('app', () => {
    const result = run()
    expect(result).toMatchSnapshot()
  })
})
