import * as path from 'node:path'

import { chalk } from '@tarojs/helper'

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
})
