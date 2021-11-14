// 需要新增额外的原生 API 时，分拆一个单独的 `apis-list.ts` 文件能有利于维护。

// 同步 API
export const noPromiseApis = new Set([
  'getAccountInfoSync'
])

// 异步 API，这些 API 都可以设置 `success`、`fail`、`complete` 回调，需要对它们进行 Promise 化。
export const needPromiseApis = new Set([
  'addCard'
])
