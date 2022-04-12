import { w3cApiRegistry } from '../../utils'
import { getLocationByW3CApi } from './location'

// 导出避免被Tree Sharking
export default () => {
  w3cApiRegistry.register([{
    apiName: 'getLocation',
    processApi: (options) => getLocationByW3CApi(options)
  }])
}
