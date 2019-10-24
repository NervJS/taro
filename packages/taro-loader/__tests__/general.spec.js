import { compile } from './compile'

describe('general', () => {
  describe('not export default', () => {
    test('app', async () => {
      async function check () {
        await compile('not-export-default.txt', { type: 'app', framework: 'vue' })
      }
      await expect(check()).rejects.toBeTruthy()
    })

    test('page', async () => {
      async function check () {
        await compile('not-export-default.txt', { type: 'page', framework: 'vue' })
      }
      await expect(check()).rejects.toBeTruthy()
    })

    test('react', async () => {
      async function check () {
        await compile('not-export-default.txt', { type: 'app', framework: 'react' })
      }
      await expect(check()).rejects.toBeTruthy()
    })
  })

  describe.skip('syntax', () => {
    test('tsx', async () => {
      const result = await compile('syntax-tsx.txt', { type: 'page', framework: 'react' })
      expect(result).toBe('')
    })
  })
})
