/**
 * @tarojs/project-graph — SCC 强连通分量检测（WP6b，§4.4）
 *
 * 在**组件依赖图**上求强连通分量，识别组件间循环依赖（cycle）。
 *
 * §4.4 SCC 契约：
 *  - 只纳入 **local 组件之间** resolved 的 `usingComponent` ∪ `componentUsage`
 *    两类边的并集（任一类构成的回路都是真环）。
 *  - npm 是递归终点（无出边）、external/unresolved 不入环——只有两端都是 local
 *    组件的边参与。
 *  - Page/App → 组件的入口边**不参与**（SCC 只在组件子图上跑）。
 *  - self-loop（组件自引用）视为 cycle。
 *  - SCC id、成员、输出顺序必须**稳定**（用成员 id 字典序）。
 *
 * 用 Tarjan 算法（迭代式，避免深链爆栈）。
 */

import type { IComponentNode, IEdge } from './schema'

/** 一个强连通分量（size≥2，或 size=1 且自环）——即一个组件依赖环。 */
export interface ISccCycle {
  /** 环成员组件 node id，稳定字典序。 */
  members: string[]
}

/** SCC 检测的最小输入：组件节点 + 全部边（只用 components/edges，不需完整 envelope）。 */
export interface ISccInput {
  components: IComponentNode[]
  edges: IEdge[]
}

/**
 * 求组件依赖图的所有 cycle（强连通分量，§4.4）。
 *
 * 只在 local 组件子图上跑：节点 = sourceKind==='local' 的组件；边 = 两端都是 local
 * 组件、resolution==='local' 的 usingComponent/componentUsage 边并集。返回所有真环
 * （size≥2 的 SCC，或存在自环的单点 SCC），按首成员 id 字典序稳定排序。
 */
export function findComponentCycles(graph: ISccInput): ISccCycle[] {
  // local 组件节点集合。
  const localIds = new Set(graph.components.filter((c) => c.sourceKind === 'local').map((c) => c.id))

  // 邻接表：仅 local→local 的组件边（usingComponent ∪ componentUsage，resolution=local）。
  const adj = new Map<string, Set<string>>()
  for (const id of localIds) adj.set(id, new Set())
  const selfLoops = new Set<string>()
  for (const e of graph.edges) {
    if (!isComponentEdge(e)) continue
    if (e.resolution !== 'local' || e.to == null) continue
    if (!localIds.has(e.from) || !localIds.has(e.to)) continue // 入口边(from=page/app)或非 local 端排除
    if (e.from === e.to) {
      selfLoops.add(e.from)
      continue
    }
    adj.get(e.from)!.add(e.to)
  }

  // 稳定遍历顺序：节点按 id 字典序。
  const nodes = [...localIds].sort()
  const sccs = tarjan(nodes, adj)

  const cycles: ISccCycle[] = []
  for (const comp of sccs) {
    if (comp.length >= 2) {
      cycles.push({ members: [...comp].sort() })
    } else if (comp.length === 1 && selfLoops.has(comp[0])) {
      cycles.push({ members: [comp[0]] }) // 自环单点也是 cycle
    }
  }
  // 输出稳定排序：按首成员 id。
  cycles.sort((a, b) => (a.members[0] < b.members[0] ? -1 : a.members[0] > b.members[0] ? 1 : 0))
  return cycles
}

/** 组件引用边（有 to/resolution）判定。 */
function isComponentEdge(e: IEdge): e is Extract<IEdge, { kind: 'usingComponent' | 'componentUsage' }> {
  return e.kind === 'usingComponent' || e.kind === 'componentUsage'
}

/**
 * Tarjan 强连通分量（迭代式，避免递归爆栈）。
 * @param nodes 节点 id 列表（已按稳定序排列，决定 SCC 发现顺序）
 * @param adj   邻接表（每个节点的后继集合）
 * @returns SCC 列表（每个是节点 id 数组）
 */
function tarjan(nodes: string[], adj: Map<string, Set<string>>): string[][] {
  let index = 0
  const indices = new Map<string, number>()
  const lowlink = new Map<string, number>()
  const onStack = new Set<string>()
  const stack: string[] = []
  const sccs: string[][] = []

  // 后继按 id 字典序，保证确定性。
  const successors = (v: string): string[] => [...(adj.get(v) ?? [])].sort()

  for (const start of nodes) {
    if (indices.has(start)) continue
    // 迭代式 DFS：帧记录节点 + 其后继遍历游标。
    const callStack: Array<{ v: string, succ: string[], i: number }> = [
      { v: start, succ: successors(start), i: 0 },
    ]
    indices.set(start, index)
    lowlink.set(start, index)
    index++
    stack.push(start)
    onStack.add(start)

    while (callStack.length > 0) {
      const frame = callStack[callStack.length - 1]
      if (frame.i < frame.succ.length) {
        const w = frame.succ[frame.i]
        frame.i++
        if (!indices.has(w)) {
          indices.set(w, index)
          lowlink.set(w, index)
          index++
          stack.push(w)
          onStack.add(w)
          callStack.push({ v: w, succ: successors(w), i: 0 })
        } else if (onStack.has(w)) {
          lowlink.set(frame.v, Math.min(lowlink.get(frame.v)!, indices.get(w)!))
        }
      } else {
        // 回溯：若 v 是 SCC 根，弹出整个分量。
        if (lowlink.get(frame.v) === indices.get(frame.v)) {
          const comp: string[] = []
          let w: string
          do {
            w = stack.pop()!
            onStack.delete(w)
            comp.push(w)
          } while (w !== frame.v)
          sccs.push(comp)
        }
        callStack.pop()
        // 把 v 的 lowlink 传播给父帧。
        if (callStack.length > 0) {
          const parent = callStack[callStack.length - 1]
          parent && lowlink.set(parent.v, Math.min(lowlink.get(parent.v)!, lowlink.get(frame.v)!))
        }
      }
    }
  }
  return sccs
}
