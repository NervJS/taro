import { compile, pretty } from './compile'

describe('page loader', () => {
  describe('react', () => {
    test('basic', async () => {
      const result = await compile('basic_1.txt', { type: 'page', framework: 'react' })

      expect(result).toBe(pretty(`
        import { createPageConfig } from "@tarojs/runtime";
        import { app } from "./app";
        Page(createPageConfig(app));
      `))
    })
  })
})
