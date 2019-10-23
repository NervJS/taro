const path = require('path')
const fs = require('fs')
const compileSass = require('../index')

const sassContent = `
.index {
  background-color: #ececec;
}
`

const indexPath = path.resolve(__dirname, '.', 'styles/index.scss')

const singlePath = path.resolve(__dirname, '.', 'styles/single.scss')
const singlePathContent = fs.readFileSync(singlePath)
const singleConfig = {
  resource: path.resolve(__dirname, '.', 'styles/variables.scss')
}
const singleConfigWithDirectory = {
  resource: 'styles/variables.scss',
  projectDirectory: path.resolve(__dirname, '.')
}

const multiplePath = path.resolve(__dirname, '.', 'styles/multiple.scss')
const multiplePathContent = fs.readFileSync(multiplePath)
const multipleConfig = {
  resource: [
    path.resolve(__dirname, '.', 'styles/variables.scss'),
    path.resolve(__dirname, '.', 'styles/mixins.scss')
  ]
}
const multipleConfigWithDirectory = {
  resource: [
    'styles/variables.scss',
    'styles/mixins.scss'
  ],
  projectDirectory: path.resolve(__dirname, '.')
}

describe('compileSass', () => {
  test('text compile only content', async () => {
    const res = await compileSass(sassContent, '', {})
    expect(res.css.toString()).toMatchSnapshot()
  })

  test('text compile only sass file path', async () => {
    const res = await compileSass('', indexPath, {})
    expect(res.css.toString()).toMatchSnapshot()
  })

  test('text compile sass file and single resource path', async () => {
    const res = await compileSass(singlePathContent, singlePath, singleConfig)
    expect(res.css.toString()).toMatchSnapshot()
  })

  test('text compile sass file and single resource file with directory', async () => {
    const res = await compileSass(singlePathContent, singlePath, singleConfigWithDirectory)
    expect(res.css.toString()).toMatchSnapshot()
  })

  test('text compile sass file and multiple resource path', async () => {
    const res = await compileSass(multiplePathContent, multiplePath, multipleConfig)
    expect(res.css.toString()).toMatchSnapshot()
  })

  test('text compile sass file and multiple resource file with directory', async () => {
    const res = await compileSass(multiplePathContent, multiplePath, multipleConfigWithDirectory)
    expect(res.css.toString()).toMatchSnapshot()
  })
})
