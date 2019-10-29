import { buildTemplates } from '../src/template/index'

describe('template', () => {
  test('test', () => {
    const result = buildTemplates(10)
    debugger
    expect(() => buildTemplates(5)).not.toThrowError()

    expect(false).toBeTruthy()
  })
})
