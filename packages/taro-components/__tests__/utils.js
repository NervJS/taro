export function waitForChange (dom) {
  return new Promise((resolve) => {
    let timer

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

export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
