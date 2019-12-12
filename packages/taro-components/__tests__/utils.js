export function waitForChange (dom) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      observer.disconnect()
      resolve()
    })

    setTimeout(() => {
      reject(new Error('DOM 没有改变'))
    }, 500)

    observer.observe(dom, { attributes: true, childList: true, subtree: true })
  })
}
