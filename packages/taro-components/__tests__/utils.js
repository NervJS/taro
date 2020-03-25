export function waitForChange (dom) {
  return new Promise((resolve) => {
    let timer

    const observer = new MutationObserver(() => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        observer.disconnect()
        resolve()
      }, 500)
    })

    setTimeout(() => {
      resolve()
    }, 3000)

    observer.observe(dom, { attributes: true, childList: true, subtree: true })
  })
}

export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
