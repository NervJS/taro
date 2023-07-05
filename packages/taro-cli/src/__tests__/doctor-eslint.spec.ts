import { chalk } from '@tarojs/helper'
import * as path from 'path'

import doctor from '../doctor'

const validator = doctor.validators[4]

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
    const { isValid, messages } = await validator({
      projectConfig: {
        framework: 'react',
        sourceRoot: 'src'
      },
      chalk
    })
    expect(isValid).toBe(true)
    expect(messages.length).toBe(2)
  })

  it('should lint for nerv', async () => {
    process.chdir(path.join(__dirname, 'fixtures/nerv'))
    const { isValid, messages } = await validator({
      projectConfig: {
        framework: 'nerv',
        sourceRoot: 'src'
      },
      chalk
    })
    expect(isValid).toBe(false)
    expect(messages[1].content.includes('\'a\' is assigned a value but never used'))
  })

  it('should lint for vue', async () => {
    process.chdir(path.join(__dirname, 'fixtures/vue'))
    const { isValid, messages } = await validator({
      projectConfig: {
        framework: 'vue',
        sourceRoot: 'src'
      },
      chalk
    })

    expect(isValid).toBe(true)
    expect(messages.length).toBe(2)
  })
})
