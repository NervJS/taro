
import Taro from '@tarojs/taro'

describe('taro interceptorify', () => {
  it('onion competency model', async () => {
    interface IParams {
      msg: string
    }
    const execLink = Taro.interceptorify<IParams, IParams>(async function (requestParams) {
      requestParams.msg += '__exec'
      return requestParams
    })
    execLink.addInterceptor(async function (chain) {
      chain.requestParams.msg += '__before1'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after1'
      return params
    })
    execLink.addInterceptor(async function (chain) {
      chain.requestParams.msg += '__before2'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after2'
      return params
    })
    execLink.addInterceptor(async function (chain) {
      chain.requestParams.msg += '__before3'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after3'
      return params
    })
    const res1 = await execLink.request({ msg: 'test1' })
    expect(res1.msg).toBe('test1__before1__before2__before3__exec__after3__after2__after1')

    execLink.cleanInterceptors()
    const res2 = await execLink.request({ msg: 'test2' })
    expect(res2.msg).toBe('test2__exec')
  })

})
