export let routesAlias = {}

export function setRoutesAlias (alias) {
  routesAlias = alias
}

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

// 解决navigateBack调用delta>1时,路由栈异常问题
// 比如:A->B->C,navigateBack({delta: 2}),此时路由栈中还存在B页面
// 原因:主要是由于一次性退出多层级页面时,此action只会执行一次,此处进行手动处理
export let historyBackDelta = 1;

export function setHistoryBackDelta(delta = 1) {
  historyBackDelta = delta;
}
