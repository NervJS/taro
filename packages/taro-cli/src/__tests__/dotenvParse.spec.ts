import { dotenvParse } from '../util/index'


describe('dotenvParse', () => {
  it('dotenvParse .env .env.dev should success', async () => {

    expect(process.env.TARO_test).toBeUndefined()
    dotenvParse('./src/__tests__/env', 'TARO_', 'dev')
    expect(process.env.TARO_test).toBe('123')
    expect(process.env._TARO_test).toBeUndefined()
  })
})
