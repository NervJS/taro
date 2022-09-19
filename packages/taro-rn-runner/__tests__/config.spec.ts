import { getRNConfigEntry } from '../src/config/config-holder'

const path = require('path')

describe('init', () => {
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue(path.resolve(__dirname, '', 'mock'))
  process.env = {
    NODE_ENV: 'development'
  }

  it('getRNConfigEntry', () => {
    expect(getRNConfigEntry()).toEqual('app')
  })

})
