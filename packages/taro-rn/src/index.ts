import * as api from './api'
import * as lib from './lib'

const Taro = {
  ...api,
  ...lib
}

export * from './api'
export * from './lib'

export default Taro
