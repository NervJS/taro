import { buildTemplates } from '../src/template/index'

describe('template', () => {
  test('test', () => {
    expect(() => buildTemplates(10)).not.toThrowError()

    expect(false).toBeTruthy()
  })
})
