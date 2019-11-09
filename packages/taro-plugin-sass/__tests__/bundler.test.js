const path = require('path')
const getBundleContent = require('../bundler')

const filePath = path.resolve(__dirname, '.', 'styles/variables.scss')
const fileConfig = {
  name: 'styles/variables.scss',
  path: path.resolve(__dirname, '.')
}

describe('getBundleContent', () => {
  test('test file path', async () => {
    const res = await getBundleContent(filePath)
    expect(res.bundledContent).toMatchSnapshot()
  })

  test('test file name and project directory path', async () => {
    const res = await getBundleContent(fileConfig.name, fileConfig.path)
    expect(res.bundledContent).toMatchSnapshot()
  })
})
