import { temporarilyNotSupport } from '../../utils'

const router = {
  addRouteBuilder: /* @__PURE__ */ temporarilyNotSupport('addRouteBuilder'),
  getRouteContext: /* @__PURE__ */ temporarilyNotSupport('getRouteContext'),
  removeRouteBuilder: /* @__PURE__ */ temporarilyNotSupport('removeRouteBuilder')
}

// 路由
export {
  navigateBack,
  navigateTo,
  redirectTo,
  reLaunch,
  switchTab,
} from '@tarojs/router'

export {
  router
}

// FIXME 方法导出类型未对齐，后续修复
