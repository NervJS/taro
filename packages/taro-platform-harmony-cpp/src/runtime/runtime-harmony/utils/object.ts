export function ObjectKeys(obj: object): string[] {
  return Object.keys(obj)
}

export function ObjectAssign(...objects) {
  return Object.assign.apply(this, [].concat(...objects))
}

export function callFn (fn: any, ctx: any, ...args: any) {
  if (typeof fn === 'function') {
    return fn.apply(ctx, args)
  }
}
export function bindFn (fn: any, ctx: any, ...args: any) {
  if (typeof fn === 'function') {
    return fn.bind(ctx, ...args)
  }
}

export function combinePrototypeOf(obj) {
  // 如果 obj 不是一个对象（null 或其他非对象类型），直接返回空对象
  if (typeof obj !== 'object' || obj === null) {
    return {}
  }

  const newObj = {}
  const proto = Object.getPrototypeOf(obj)

  // 如果没有原型，直接返回对象
  if (!proto) {
    return { ...obj, ...newObj }
  }

  // 遍历原型的自有属性并赋值到对象
  for (const key of Reflect.ownKeys(proto)) {
    try {
      // 检查属性是否为函数，避免不可访问的属性抛出错误
      if (typeof proto[key] === 'function') {
        obj[key] = proto[key]
      }
    } catch (error) {
      // 如果某些属性不可访问（例如代理对象的陷阱），忽略错误
      console.error(`Error(combinePrototypeOf) accessing property '${String(key)}':`, error)
    }
  }

  // 返回合并后的对象
  return { ...obj, ...newObj }
}
