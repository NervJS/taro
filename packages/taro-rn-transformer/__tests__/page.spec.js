import * as path from 'path'
import * as transformer from '../dist/index'

const Home = `import './app.scss';
import * as React from 'React'
class HomeScreen extends React.Component {
  render () {
    return null
  }
}`

const Page = `
import * as React from 'React'
class HomeScreen extends React.Component {
  render () {
    return null
  }
}
`

function run () {
  const options = {
    projectRoot: path.resolve(__dirname),
    isEntryFile: () => { return false },
    nextTransformer: ({ src }) => { return src }
  }
  const commonPath = path.join(path.resolve(__dirname), 'src/app.scss')
  const arr = []
  arr.push({
    name: '',
    path: commonPath,
    fileName: 'app.scss'
  })
  global.__taroCommonStyle = arr
  global.__taroAppPages = ['src/pages']
  const code = transformer.transform({ src: Page, filename: 'src/pages', options })
  return code
}

describe('page-loader', () => {
  it('page', () => {
    const result = run()
    expect(result).toMatch(Home)
  })
})
