import path from 'node:path'
import type { IProjectFactsSnapshot } from './facts'
import type { IProjectGraph } from './schema'

export type TProfilePlatform =
  | 'weapp'
  | 'jd'
  | 'tt'
  | 'swan'
  | 'alipay'
  | 'qq'
  | 'h5'
  | 'dynamic'
  | 'jdharmony_cpp'
  | 'ios'
  | 'android'
  | 'unknown'

export interface IProjectProfileProjection {
  root: string
  gitBranch?: string
  framework: 'react' | 'vue' | 'unknown'
  compiler: 'webpack5' | 'vite' | 'unknown'
  taroVersion?: string
  platforms: TProfilePlatform[]
  plugins: string[]
  configuredPlugins?: string[]
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'unknown'
  packageManagerVersion?: string
  nodeVersion?: string
  system?: string
  lockfiles: Array<{
    kind: 'pnpm' | 'npm' | 'yarn'
    path: string
    matchesPackageManager: boolean
  }>
  configFiles: string[]
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  installedDependencies: Record<string, string>
  sourceRoot?: string
}

export type TStaticGraphNodeKind = 'page' | 'component' | 'module'
export type TStaticGraphEdgeKind = 'route' | 'import' | 'dynamic_import'
export type TStaticGraphWarningKind = 'unresolved_import' | 'circular_dependency'

export interface IStaticGraphNodeProjection {
  id: string
  kind: TStaticGraphNodeKind
  label: string
  file: string
  route?: string
  importCount: number
  importedByCount: number
}

export interface IStaticGraphEdgeProjection {
  id: string
  from: string
  to: string
  kind: TStaticGraphEdgeKind
  source: string
}

export interface IStaticGraphWarningProjection {
  id: string
  kind: TStaticGraphWarningKind
  message: string
  file?: string
  importSource?: string
  nodes?: string[]
}

export interface IStaticProjectGraphProjection {
  summary: {
    pageCount: number
    componentCount: number
    moduleCount: number
    edgeCount: number
    unresolvedImportCount: number
    circularDependencyCount: number
  }
  pages: IStaticGraphNodeProjection[]
  components: IStaticGraphNodeProjection[]
  modules: IStaticGraphNodeProjection[]
  edges: IStaticGraphEdgeProjection[]
  warnings: IStaticGraphWarningProjection[]
}

export function projectFactsToProjectProfile(snapshot: IProjectFactsSnapshot): IProjectProfileProjection {
  const dependencies = snapshot.dependencies
  const taroVersion = dependencies.installedDependencies['@tarojs/taro'] ??
    dependencies.installedDependencies['@tarojs/cli'] ??
    dependencies.dependencies['@tarojs/taro'] ??
    dependencies.devDependencies['@tarojs/cli']

  return {
    root: snapshot.project.root,
    ...(snapshot.repository?.branch ? { gitBranch: snapshot.repository.branch } : {}),
    framework: toProfileFramework(snapshot.project.framework),
    compiler: snapshot.project.compiler,
    ...(taroVersion ? { taroVersion } : {}),
    platforms: toProfilePlatforms(snapshot.platform.configuredTargets),
    plugins: collectPluginNames(snapshot),
    configuredPlugins: [...snapshot.project.plugins],
    packageManager: dependencies.packageManager === 'cnpm' ? 'unknown' : dependencies.packageManager,
    ...(dependencies.packageManagerVersion ? { packageManagerVersion: dependencies.packageManagerVersion } : {}),
    ...(snapshot.toolchain.node.version ? { nodeVersion: snapshot.toolchain.node.version } : {}),
    system: `${snapshot.toolchain.operatingSystem.platform} ${snapshot.toolchain.operatingSystem.architecture}`,
    lockfiles: dependencies.lockfiles.map(lockfile => ({
      kind: lockfile.kind,
      path: path.resolve(
        lockfile.rootId === 'project'
          ? snapshot.project.root
          : snapshot.workspaceManifest.roots.find(root => root.rootId === lockfile.rootId)?.originalPath ?? snapshot.project.root,
        lockfile.relativePath
      ),
      matchesPackageManager: lockfile.matchesPackageManager,
    })),
    configFiles: snapshot.project.configFiles.map(file => path.resolve(snapshot.project.root, file)),
    dependencies: { ...dependencies.dependencies },
    devDependencies: { ...dependencies.devDependencies },
    installedDependencies: { ...dependencies.installedDependencies },
    ...(snapshot.project.sourceRoot ? { sourceRoot: snapshot.project.sourceRoot } : {}),
  }
}

export function projectFactsToStaticProjectGraph(snapshot: IProjectFactsSnapshot): IStaticProjectGraphProjection {
  const graph = snapshot.projectGraph
  const root = snapshot.workspaceManifest.roots.find(entry => entry.rootId === 'project')?.originalPath ?? snapshot.project.root
  const sourceRoot = snapshot.project.sourceRoot ?? 'src'
  const nodeByGraphId = new Map<string, IStaticGraphNodeProjection>()
  const nodesByFile = new Map<string, IStaticGraphNodeProjection>()

  if (graph.app.filePath) addNode(nodeByGraphId, nodesByFile, graph.app.id, createNode(root, sourceRoot, graph.app.filePath, 'module'))
  for (const page of graph.pages) {
    addNode(nodeByGraphId, nodesByFile, page.id, createNode(root, sourceRoot, page.filePath, 'page', page.routePath))
  }
  for (const component of graph.components) {
    if (component.sourceKind !== 'local' || !component.resolvedFilePath) continue
    addNode(nodeByGraphId, nodesByFile, component.id, createNode(root, sourceRoot, component.resolvedFilePath, 'component'))
  }

  const edges = collectProjectionEdges(graph, nodeByGraphId)
  updateDegrees(nodesByFile, edges)
  const warnings = collectProjectionWarnings(graph, nodeByGraphId)
  const pages = getNodes(nodesByFile, 'page')
  const components = getNodes(nodesByFile, 'component')
  const modules = getNodes(nodesByFile, 'module')

  return {
    summary: {
      pageCount: pages.length,
      componentCount: components.length,
      moduleCount: modules.length,
      edgeCount: edges.length,
      unresolvedImportCount: warnings.filter(warning => warning.kind === 'unresolved_import').length,
      circularDependencyCount: warnings.filter(warning => warning.kind === 'circular_dependency').length,
    },
    pages,
    components,
    modules,
    edges,
    warnings,
  }
}

function collectProjectionEdges(
  graph: IProjectGraph,
  nodeByGraphId: Map<string, IStaticGraphNodeProjection>
): IStaticGraphEdgeProjection[] {
  const edges = new Map<string, IStaticGraphEdgeProjection>()
  const app = nodeByGraphId.get(graph.app.id)

  if (app) {
    for (const page of graph.pages) {
      const pageNode = nodeByGraphId.get(page.id)
      if (pageNode) addEdge(edges, app, pageNode, 'route', page.routePath.replace(/^\//, ''))
    }
  }

  for (const edge of graph.edges) {
    if (edge.kind === 'navigation') continue
    const from = nodeByGraphId.get(edge.from)
    const to = edge.to ? nodeByGraphId.get(edge.to) : undefined
    if (from && to) addEdge(edges, from, to, 'import', edge.rawSpecifier)
  }

  return [...edges.values()].sort((left, right) => left.id.localeCompare(right.id))
}

function collectProjectionWarnings(
  graph: IProjectGraph,
  nodeByGraphId: Map<string, IStaticGraphNodeProjection>
): IStaticGraphWarningProjection[] {
  const warnings: IStaticGraphWarningProjection[] = []

  for (const edge of graph.edges) {
    if (edge.kind === 'navigation' || edge.resolution !== 'unresolved') continue
    warnings.push({
      id: `unresolved:${edge.from}:${edge.rawSpecifier}`,
      kind: 'unresolved_import',
      message: `Unable to resolve import "${edge.rawSpecifier}".`,
      ...(nodeByGraphId.get(edge.from)?.file ? { file: nodeByGraphId.get(edge.from)?.file } : {}),
      importSource: edge.rawSpecifier,
    })
  }

  for (const issue of graph.issues) {
    if (issue.kind !== 'cycle' || !issue.sccMembers?.length) continue
    const nodes = [...new Set(issue.sccMembers.flatMap(member => nodeByGraphId.get(member)?.file ?? []))].sort()
    warnings.push({
      id: `cycle:${issue.sccMembers.join(':')}`,
      kind: 'circular_dependency',
      message: issue.message,
      nodes: nodes.length > 0 ? [...nodes, nodes[0]] : [],
    })
  }

  return warnings.sort((left, right) => left.id.localeCompare(right.id))
}

function createNode(
  root: string,
  sourceRoot: string,
  absoluteFile: string,
  kind: TStaticGraphNodeKind,
  route?: string
): IStaticGraphNodeProjection {
  const file = toProjectPath(root, absoluteFile)
  const sourceRelativeFile = path.posix.relative(sourceRoot.replaceAll('\\', '/'), file)
  const fileLabel = sourceRelativeFile.replace(new RegExp(`${escapeRegExp(path.posix.extname(sourceRelativeFile))}$`), '')
  return {
    id: file,
    kind,
    label: route?.replace(/^\//, '') ?? fileLabel,
    file,
    ...(route ? { route: route.replace(/^\//, '') } : {}),
    importCount: 0,
    importedByCount: 0,
  }
}

function addNode(
  nodeByGraphId: Map<string, IStaticGraphNodeProjection>,
  nodesByFile: Map<string, IStaticGraphNodeProjection>,
  graphId: string,
  node: IStaticGraphNodeProjection
): void {
  const existing = nodesByFile.get(node.file)
  const selected = existing ?? node
  if (!existing) nodesByFile.set(node.file, node)
  nodeByGraphId.set(graphId, selected)
}

function addEdge(
  edges: Map<string, IStaticGraphEdgeProjection>,
  from: IStaticGraphNodeProjection,
  to: IStaticGraphNodeProjection,
  kind: TStaticGraphEdgeKind,
  source: string
): void {
  const id = `${kind}:${from.id}->${to.id}:${source}`
  edges.set(id, { id, from: from.id, to: to.id, kind, source })
}

function updateDegrees(nodes: Map<string, IStaticGraphNodeProjection>, edges: IStaticGraphEdgeProjection[]): void {
  for (const edge of edges) {
    const from = nodes.get(edge.from)
    const to = nodes.get(edge.to)
    if (from) from.importCount += 1
    if (to) to.importedByCount += 1
  }
}

function getNodes(nodes: Map<string, IStaticGraphNodeProjection>, kind: TStaticGraphNodeKind): IStaticGraphNodeProjection[] {
  return [...nodes.values()].filter(node => node.kind === kind).sort((left, right) => left.id.localeCompare(right.id))
}

function toProjectPath(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join(path.posix.sep)
}

function toProfileFramework(framework: IProjectFactsSnapshot['project']['framework']): IProjectProfileProjection['framework'] {
  if (framework === 'vue3') return 'vue'
  if (framework === 'react' || framework === 'preact') return 'react'
  return 'unknown'
}

function toProfilePlatforms(platforms: string[]): TProfilePlatform[] {
  const order: TProfilePlatform[] = [
    'weapp',
    'jd',
    'tt',
    'swan',
    'alipay',
    'qq',
    'h5',
    'dynamic',
    'jdharmony_cpp',
    'ios',
    'android',
  ]
  const selected = new Set(platforms)
  const projected = order.filter(platform => selected.has(platform))
  if (platforms.some(platform => !order.includes(platform as TProfilePlatform))) projected.push('unknown')
  return projected
}

function collectPluginNames(snapshot: IProjectFactsSnapshot): string[] {
  const configured = snapshot.projectGraph.plugins.map(plugin => plugin.id)
  const declared = [
    ...Object.keys(snapshot.dependencies.dependencies),
    ...Object.keys(snapshot.dependencies.devDependencies),
  ].filter(isPluginPackageName)
  return [...new Set([...declared, ...snapshot.project.plugins, ...configured])]
}

function isPluginPackageName(value: string): boolean {
  return /^(?:@[a-z0-9_.-]+\/[a-z0-9_.-]*plugin[a-z0-9_.-]*|[a-z0-9_.-]*plugin[a-z0-9_.-]*)$/i.test(value)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
