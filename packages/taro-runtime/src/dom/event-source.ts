import type { TaroNode } from './node'

interface IEventSource extends Map<string | undefined | null, TaroNode> {
  removeNode (child: TaroNode): void
  removeNodeTree (child: TaroNode): void
}

class EventSource extends Map {
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
