/**
 * 用于存储回调函数引用的Map对象,该公共Map只适用于关闭监听函数的参数为非可选的API。
 * key: 原始回调
 * value: 重新构造了回参的回调
 */
export const taroCallbackMap: Map<any, any> = new Map()
