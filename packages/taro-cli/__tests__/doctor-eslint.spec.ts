import * as path from 'path'
import validator from '../src/doctor/eslintValidator'

describe('eslint validator of doctor', () => {
  it('should lint for react', () => {
    process.chdir(path.join(__dirname, 'fixtures/default'))
    const { raw } = validator({
      projectConfig: {
        framework: 'react',
        sourceRoot: 'src'
      }
    })

    expect(raw).toBe('')
  })

  it('should lint for nerv', () => {
    process.chdir(path.join(__dirname, 'fixtures/nerv'))
    const { raw } = validator({
      projectConfig: {
        framework: 'nerv',
        sourceRoot: 'src'
      }
    })

    expect(raw.includes('\'a\' is assigned a value but never used'))
  })

  it('should lint for vue', () => {
    process.chdir(path.join(__dirname, 'fixtures/vue'))
    const { raw } = validator({
      projectConfig: {
        framework: 'vue',
        sourceRoot: 'src'
      }
    })

    expect(raw).toBe('')
  })
})
