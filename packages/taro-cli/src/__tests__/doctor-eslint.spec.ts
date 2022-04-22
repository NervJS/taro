import * as path from 'path'
import validator from '../doctor/eslintValidator'

describe('eslint validator of doctor', () => {
  let cwd = ''
  beforeEach(() => {
    cwd = process.cwd()
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  it('should lint for react', async () => {
    process.chdir(path.join(__dirname, 'fixtures/default'))
    const raw = await validator({
      projectConfig: {
        framework: 'react',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw).toBe('')
  })

  it('should lint for nerv', async () => {
    process.chdir(path.join(__dirname, 'fixtures/nerv'))
    const raw = await validator({
      projectConfig: {
        framework: 'nerv',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw.includes('\'a\' is assigned a value but never used'))
  })

  it('should lint for vue', async () => {
    process.chdir(path.join(__dirname, 'fixtures/vue'))
    const raw = await validator({
      projectConfig: {
        framework: 'vue',
        sourceRoot: 'src'
      }
    }).then(e => e.raw)

    expect(raw).toBe('')
  })
})
