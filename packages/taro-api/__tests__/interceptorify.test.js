
import Taro from '@tarojs/taro'

describe('taro interceptorify', () => {
  it('onion competency model', async () => {
    async function exec (requestParams) {
      requestParams.msg += '__exec'
      return requestParams
    }
    async function interceptor1 (chain) {
      chain.requestParams.msg += '__before1'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after1'
      return params
    }
    async function interceptor2 (chain) {
      chain.requestParams.msg += '__before2'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after2'
      return params
    }
    async function interceptor3 (chain) {
      chain.requestParams.msg += '__before3'
      const params = await chain.proceed(chain.requestParams)
      params.msg += '__after3'
      return params
    }

    const execLink = Taro.interceptorify(exec)
    execLink.addInterceptor(interceptor1)
    execLink.addInterceptor(interceptor2)
    execLink.addInterceptor(interceptor3)

    const res = await execLink.request({ msg: 'init' })
    expect(res.msg).toBe('init__before1__before2__before3__exec__after3__after2__after1')
  })

})
