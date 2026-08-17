/**
 * SCC cycle 检测测试（WP6b，§4.4）。纯函数单测：构造 components + edges 直接验证。
 */
import { findComponentCycles } from '../scc'

import type { IComponentNode, IEdge } from '../schema'

/** 造一个 local 组件节点。 */
function localComp(id: string): IComponentNode {
  return { id, sourceKind: 'local', resolvedFilePath: `/p/${id}.tsx`, configAnalyzerStatus: 'complete', jsxAnalyzerStatus: 'complete' }
}
/** 造一个 npm 组件节点。 */
function npmComp(id: string): IComponentNode {
  return { id, sourceKind: 'npm', packageName: id, configAnalyzerStatus: 'complete', jsxAnalyzerStatus: 'complete' }
}
/** 造一条组件边。 */
function edge(from: string, to: string, kind: 'usingComponent' | 'componentUsage' = 'usingComponent', resolution: 'local' | 'npm' = 'local'): IEdge {
  return { kind, from, to, resolution, rawSpecifier: to } as IEdge
}

describe('findComponentCycles — SCC（§4.4）', () => {
  test('无环 → 空', () => {
    const components = [localComp('A'), localComp('B')]
    const edges = [edge('A', 'B')]
    expect(findComponentCycles({ components, edges })).toEqual([])
  })

  test('二元环 A↔B → 一个 cycle，成员稳定字典序', () => {
    const components = [localComp('A'), localComp('B')]
    const edges = [edge('A', 'B'), edge('B', 'A')]
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toEqual(['A', 'B'])
  })

  test('自环 A→A → cycle（self-loop 视为环）', () => {
    const components = [localComp('A')]
    const edges = [edge('A', 'A')]
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toEqual(['A'])
  })

  test('三元环 A→B→C→A', () => {
    const components = [localComp('A'), localComp('B'), localComp('C')]
    const edges = [edge('A', 'B'), edge('B', 'C'), edge('C', 'A')]
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toEqual(['A', 'B', 'C'])
  })

  test('两个独立环 → 两个 cycle，按首成员稳定排序', () => {
    const components = ['A', 'B', 'X', 'Y'].map(localComp)
    const edges = [edge('A', 'B'), edge('B', 'A'), edge('X', 'Y'), edge('Y', 'X')]
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(2)
    expect(cycles.map((c) => c.members[0])).toEqual(['A', 'X']) // 稳定排序
  })

  test('componentUsage 边也构成环（两类边并集）', () => {
    const components = [localComp('A'), localComp('B')]
    const edges = [edge('A', 'B', 'componentUsage'), edge('B', 'A', 'usingComponent')]
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toEqual(['A', 'B'])
  })

  test('npm 组件不入环（递归终点无出边）', () => {
    // A→npmB，npmB 无出边 → 无环
    const components = [localComp('A'), npmComp('npmB')]
    const edges = [edge('A', 'npmB', 'usingComponent', 'npm')]
    expect(findComponentCycles({ components, edges })).toEqual([])
  })

  test('非 local resolution 的边不参与（unresolved/external 不入环）', () => {
    const components = [localComp('A'), localComp('B')]
    // A→B 是 local，B→A 标成 external（不该参与）→ 无环
    const edges = [edge('A', 'B'), { kind: 'usingComponent', from: 'B', to: 'A', resolution: 'external', rawSpecifier: 'A' } as IEdge]
    expect(findComponentCycles({ components, edges })).toEqual([])
  })

  test('Page→组件入口边不参与 SCC（from 非组件节点）', () => {
    // page 不在 components 里 → page→A 边的 from 不是 local 组件 → 排除
    const components = [localComp('A'), localComp('B')]
    const edges = [edge('pages/x/x', 'A'), edge('A', 'B'), edge('B', 'A')]
    const cycles = findComponentCycles({ components, edges })
    // 仍检出 A↔B 环，page 入口边不影响
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toEqual(['A', 'B'])
  })

  test('深链不死循环、稳定（长链末端成环）', () => {
    const ids = Array.from({ length: 50 }, (_, i) => `C${String(i).padStart(2, '0')}`)
    const components = ids.map(localComp)
    const edges: IEdge[] = []
    for (let i = 0; i < ids.length - 1; i++) edges.push(edge(ids[i], ids[i + 1]))
    edges.push(edge(ids[ids.length - 1], ids[0])) // 末端回到头 → 整条链是一个大环
    const cycles = findComponentCycles({ components, edges })
    expect(cycles).toHaveLength(1)
    expect(cycles[0].members).toHaveLength(50)
    expect(cycles[0].members[0]).toBe('C00') // 稳定排序
  })
})
