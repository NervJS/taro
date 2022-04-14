import { PageInstance } from '@tarojs/runtime'

class Stacks {
  stacks: PageInstance[] = []

  backDelta = 0

  set delta (delta: number) {
    if (delta > 0) {
      this.backDelta = delta
    } else if (this.backDelta > 0) {
      --this.backDelta
    } else {
      this.backDelta = 0
    }
  }

  get delta () {
    return this.backDelta
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

  getLastIndex (pathname: string, stateWith = 1) {
    const list = [...this.stacks].reverse()
    return list.findIndex((page, i) => i >= stateWith && page.path?.replace(/\?.*/g, '') === pathname)
  }

  getDelta (pathname: string) {
    if (this.backDelta >= 1) {
      return this.backDelta
    }
    const index = this.getLastIndex(pathname)
    // NOTE: 此处为了修复浏览器后退多级页面，在大量重复路由状况下可能出现判断错误的情况 （增强判断能力只能考虑在 query 中新增参数来判断，暂时搁置）
    return index > 0 ? index : 1
  }

  getPrevIndex (pathname: string, stateWith = 1) {
    const lastIndex = this.getLastIndex(pathname, stateWith)
    if (lastIndex < 0) {
      return -1
    }
    return this.length - 1 - lastIndex
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
