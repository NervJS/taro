import Chain from '../interceptor/chain'
import { timeoutInterceptor } from '../interceptor/interceptors'

test('timeoutInterceptor 不会在创建时抛出异常', () => {
  const chain = new Chain()

  expect(() => {
    timeoutInterceptor(chain)
  }).not.toThrow()
})
