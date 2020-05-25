import * as path from 'path'

import Kernel from '../src/Kernel'
import { PluginType } from '../src/utils/constants'

test('Kernel run', async () => {
  const testPlugin1Path = path.resolve(__dirname, './test_plugin1.ts')
  const kernel = new Kernel({
    appPath: '',
    plugins: [
      testPlugin1Path
    ]
  })

  await kernel.run('test1')
  const plugins = kernel.plugins
  const testPlugin1 = plugins.get(testPlugin1Path)
  expect(testPlugin1).toEqual(expect.objectContaining({
    id: testPlugin1Path,
    path: testPlugin1Path,
    type: PluginType.Plugin
  }))
})
