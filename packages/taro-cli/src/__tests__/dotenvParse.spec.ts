import { resolve } from 'path'

import { dotenvParse } from '../util/index'


describe('dotenvParse', () => {
  it('dotenvParse .env .env.dev should success', async () => {
    expect(process.env.TARO_test).toBeUndefined()
    dotenvParse(resolve(__dirname, 'env'), 'TARO_', 'dev')
    expect(process.env.TARO_test).toBe('123')
    expect(process.env._TARO_test).toBeUndefined()
  })
})
