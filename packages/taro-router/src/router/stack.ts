import { PageInstance } from '@tarojs/runtime'

class Stacks {
  stacks: PageInstance[] = []

  backDelta = 0

  set delta (delta: number) {
    if (delta > 0) {
      this.backDelta = delta
    } else {
      --this.backDelta
    }
  }

  get delta () {
    return this.backDelta >= 1 ? this.backDelta : 1
  }

  get length () {
    return this.stacks.length
  }

  get last () {
    return this.stacks[this.length - 1]
  }

  get () {
    return this.stacks
  }

  getItem (index: number) {
    return this.stacks[index]
  }

  getPrevIndex (pathname: string) {
    if (this.backDelta >= 1) {
      const prevIndex = this.length - 1 - this.backDelta
      if (prevIndex >= 0) return prevIndex
    }
    return this.stacks.findIndex(r => r.path?.replace(/\?.*/g, '') === pathname)
  }

  pop () {
    return this.stacks.pop()
  }

  push (page: PageInstance) {
    return this.stacks.push(page)
  }
}

const stacks = new Stacks()

export default stacks
