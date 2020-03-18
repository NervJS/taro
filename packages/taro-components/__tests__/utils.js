export function waitForChange (dom) {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      observer.disconnect()
      resolve()
    })

    setTimeout(() => {
      resolve()
    }, 1000)

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
