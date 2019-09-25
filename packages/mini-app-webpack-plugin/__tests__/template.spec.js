import { buildTemplates } from '../src/template/index'

describe('template', () => {
  test('test', () => {
    expect(() => buildTemplates(5)).not.toThrowError()

    expect(false).toBeTruthy()
  })
})
