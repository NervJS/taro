import { buildTemplates } from '../src/template/index'

describe('template', () => {
  test('test', () => {
    expect(() => buildTemplates(5)).not.toThrowError()
    const t = buildTemplates(10)
    debugger

    expect(false).toBeTruthy()
  })
})
