type ref = {
  isIntersecting: boolean
}

// @ts-ignore
class IntersectionObserver {
  list: ref[] = []

  constructor (fn: (args: ref[]) => void) {
    setTimeout(() => {
      fn([{ isIntersecting: true }])
    }, 1000)
  }

  observe () {}
  unobserve () {}
  disconnect () {}
}

window.IntersectionObserver = IntersectionObserver
global.IntersectionObserver = IntersectionObserver
