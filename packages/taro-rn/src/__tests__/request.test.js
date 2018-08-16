import Taro from '../index.js'

Taro.initNativeApi(Taro)

describe('request', () => {
  beforeEach(() => {
    const fetch = jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve({
          ok: true,
          status: 200,
          headers: {},
          json: () => {
            return Promise.resolve({ data: 'calorie' })
          },
          text: () => {
            return Promise.resolve('卡路里卡路里卡路')
          }
        })
      })
    })
    global.fetch = fetch
  })

  describe('request', () => {
    test('直接传入url时能正常返回', async () => {
      const expectData = { data: 'calorie' }

      const url = 'https://test.taro.com/v1'
      const res = await Taro.request(url)

      expect(res.data).toEqual(expectData)
    })

    test('接口数据返回json对象', async () => {
      const expectData = { data: 'calorie' }

      const url = 'https://test.taro.com/v1'
      const options = {
        url,
        responseType: 'json'
      }
      const res = await Taro.request(options)

      expect(res.data).toEqual(expectData)
    })

    test('接口数据返回text', async () => {
      const expectData = '卡路里卡路里卡路'

      const url = 'https://test.taro.com/v1'
      const options = {
        url,
        responseType: 'text'
      }
      const res = await Taro.request(options)
      expect(res.data).toMatch(expectData)
    })
  })
})
