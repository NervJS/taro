export function waitForChange (dom: Node) {
  return new Promise<void>((resolve) => {
    let timer: ReturnType<typeof setTimeout>

    const observer = new MutationObserver(() => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        observer.disconnect()
        resolve()
      }, 1000)
    })

    setTimeout(() => {
      resolve()
    }, 5000)

    observer.observe(dom, { attributes: true, childList: true, subtree: true })
  })
}

export const delay = (ms = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function toCamelCase (s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function printUnimplementedWarning (node: Node) {
  return `H5 暂不支持 ${capitalize(toCamelCase(node?.nodeName.slice(5).replace('-CORE', '').toLowerCase()))} 组件！`
}
