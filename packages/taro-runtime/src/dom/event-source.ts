import type { TaroNode } from './node'

type TaroID = string | undefined | null

type IEventSourceData = [TaroID, TaroNode][]

interface IEventSource {
  data: IEventSourceData
  clear (): void
  size (): number
  has (id: TaroID): boolean
  delete (id: TaroID): void
  get (id: TaroID): TaroNode | undefined
  set (id: TaroID, value: TaroNode): void
  removeNode (child: TaroNode): void
  removeNodeTree (child: TaroNode): void
}

class EventSource {
  data: IEventSourceData = []

  clear () {
    this.data.length = 0
  }
  
  size () {
    return this.data.length
  }

  has (id: TaroID) {
    return this.data.some(([sid]) => sid === id)
  }

  delete (id: TaroID) {
    const index = this.data.findIndex(([sid]) => sid === id)

    if (index !== -1) {
      this.data.splice(index, 1)
    }
  }

  get (id: TaroID) {
    return this.data.find(([sid]) => sid === id)?.[1]
  }

  set (id: TaroID, value: TaroNode) {
    const index = this.data.findIndex(([sid]) => sid === id)
  
    if (index !== -1) {
      this.data[index] = [id, value]
    } else {
      this.data.push([id, value])
    }
  }

  removeNode (child: TaroNode) {
    const { sid, uid } = child
    this.delete(sid)
    if (uid !== sid && uid) this.delete(uid)
  }

  removeNodeTree (child: TaroNode) {
    this.removeNode(child)
    const { childNodes } = child
    childNodes.forEach(node => this.removeNodeTree(node))
  }
}

export const eventSource: IEventSource = new EventSource()
