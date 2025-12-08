import path from 'path'
import { fileURLToPath } from 'url'
import pluginTester from 'babel-plugin-tester'
import plugin from '../dist/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

pluginTester({
  plugin,
  title: 'Convert JSX',
  fixtures: path.join(__dirname, '__unique_transform_fixtures__'),
  snapshot: true
})
