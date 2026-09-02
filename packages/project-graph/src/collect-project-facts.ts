import { execFile } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { opendir, readFile, realpath } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import {
  PROJECT_FACTS_SCHEMA_VERSION,
  type ICollectProjectFactsOptions,
  type IDependencyFacts,
  type IEnvironmentFacts,
  type IEnvironmentVariableFacts,
  type IFactsCapabilities,
  type IFactsCapabilityEntry,
  type IInvocationFacts,
  type ILockfileFacts,
  type ILocalDependencyFacts,
  type IProjectFacts,
  type IProjectFactsSnapshot,
  type IRepositoryChangedFileFacts,
  type IRepositoryFacts,
  type IToolVersionFacts,
  type IToolchainFacts,
  type IWorkspacePackageFacts,
  type IWorkspaceRoot,
  type TJsonValue,
  type TLockfileKind,
  type TPackageManagerKind,
} from './facts'
import { discoverWorkspace } from './workspace-discovery'
import {
  buildDiscoveredWorkspaceState,
  type IDiscoveredWorkspaceState,
  type IWorkspacePackageManifest,
} from './workspace-facts'
import { collectWorkspaceManifest } from './workspace-manifest'

const execFileAsync = promisify(execFile)
const CONFIG_CANDIDATES = [
  'config/index.ts',
  'config/index.js',
  'config/index.mjs',
  'config/index.cjs',
  'src/app.config.ts',
  'src/app.config.js',
  'app.config.ts',
  'app.config.js',
  'tsconfig.json',
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.prettierrc',
  '.prettierrc.js',
  '.stylelintrc',
  '.stylelintrc.js',
]
const LOCKFILE_CANDIDATES: Array<{ relativePath: string, kind: TLockfileKind }> = [
  { relativePath: 'pnpm-lock.yaml', kind: 'pnpm' },
  { relativePath: 'package-lock.json', kind: 'npm' },
  { relativePath: 'npm-shrinkwrap.json', kind: 'npm' },
  { relativePath: 'yarn.lock', kind: 'yarn' },
]
const HOST_VOLATILE_ENV = new Set([
  'HOME',
  'OLDPWD',
  'PWD',
  'SHLVL',
  'TERM',
  'TERM_PROGRAM',
  'TERM_SESSION_ID',
  'TMPDIR',
  '_',
])

interface IPackageJson {
  name?: string
  version?: string
  private?: boolean
  packageManager?: string
  scripts?: Record<string, string>
  workspaces?: unknown
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export async function collectProjectFacts(options: ICollectProjectFactsOptions): Promise<IProjectFactsSnapshot> {
  const requestedRoot = path.resolve(options.root)
  const root = await realpath(options.root)
  const packageJson = await readPackageJson(path.join(root, 'package.json'))
  const configFiles = CONFIG_CANDIDATES.filter(relativePath => existsSync(path.join(root, relativePath)))
  const configText = (await Promise.all(configFiles.map(relativePath => readText(path.join(root, relativePath)))))
    .filter((value): value is string => value !== undefined)
    .join('\n')
  const taroConfigFiles = configFiles.filter(relativePath => /^config\/index\.(?:[cm]?js|ts)$/.test(relativePath))
  const taroConfigText = (await Promise.all(taroConfigFiles.map(relativePath => readText(path.join(root, relativePath)))))
    .filter((value): value is string => value !== undefined)
    .join('\n')
  const { createProjectGraph } = await import('./graph')
  const projectGraph = createProjectGraph({
    root,
    ...(options.captureContext?.kernel ? { kernel: options.captureContext.kernel } : {}),
  }).getProjectGraph()
  const project = collectProjectMetadata(requestedRoot, packageJson, configFiles, configText, taroConfigText, projectGraph.framework)
  const workspaceState = await collectWorkspaceState(
    root,
    packageJson,
    options.captureContext?.workspaceRoots,
    options.captureContext?.invocation
  )
  const workspaceManifest = await collectWorkspaceManifest({
    roots: workspaceState.roots,
    contentSink: options.contentSink,
    excludedPaths: collectGeneratedPaths(root, project, configText),
    includedPathsByRoot: workspaceState.includedPathsByRoot,
  })
  const dependencies = await collectDependencyFacts(
    root,
    packageJson,
    workspaceManifest.entries,
    workspaceState.packageManagerRoot,
    workspaceState.packageManagerRootId,
    workspaceState.packageManagerManifest,
    options.captureContext?.invocation
  )
  const repository = await collectRepositoryFacts(root)
  const invocation = options.captureContext?.invocation
  const environment = options.captureContext?.environment ?? collectEnvironmentFacts(workspaceState.roots)
  const toolchain = await collectToolchainFacts(root, dependencies)
  const platformTargets = uniqueStrings([
    ...detectPlatforms(packageJson, project.plugins),
    ...(options.captureContext?.target ? [options.captureContext.target.platform] : []),
  ])
  const capabilities = createCapabilities({
    repository: repository ? supported() : degraded('Git repository facts are unavailable.'),
    invocation: invocation ? supported() : unsupported('No Taro capture context was provided.'),
    buildSession: options.captureContext?.buildSession ? supported() : unsupported('No build session was observed.'),
    platform: projectGraph.platformsStatus === 'complete' ? supported() : degraded('Taro Kernel platform metadata is unavailable.'),
    workspace: workspaceState.issues.length > 0
      ? degraded(workspaceState.issues.join(' '))
      : workspaceState.topology.unresolvedLocalDependencies?.length
        ? degraded('Some local workspace dependencies could not be resolved.')
        : supported(),
  })

  return {
    schemaVersion: PROJECT_FACTS_SCHEMA_VERSION,
    snapshotId: randomUUID(),
    createdAt: new Date().toISOString(),
    projectGraph,
    project,
    ...(repository ? { repository } : {}),
    workspaces: workspaceState.topology,
    dependencies,
    toolchain,
    ...(invocation ? { invocation } : {}),
    ...(options.captureContext?.buildSession ? { buildSession: options.captureContext.buildSession } : {}),
    workspaceManifest,
    environment,
    platform: {
      configuredTargets: platformTargets,
      observedTargets: options.captureContext?.target ? [options.captureContext.target] : [],
    },
    evidence: [],
    capabilities,
  }
}

function collectGeneratedPaths(root: string, project: IProjectFacts, configText: string): string[] {
 const paths = ['dist', ...(project.outputRoot ? [project.outputRoot] : [])]
  const nativeProjectMatch = configText.match(/projectPath\s*:\s*path\.resolve\([^,]+,\s*['"]([^'"]+)['"]\s*\)/)
  const nativeProjectPath = nativeProjectMatch?.[1]
  if (nativeProjectPath) {
    const absolutePath = path.isAbsolute(nativeProjectPath) ? nativeProjectPath : path.resolve(root, nativeProjectPath)
    const relativePath = path.relative(root, absolutePath)
    if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) paths.push(relativePath)
  }
  return uniqueStrings(paths.map(toPosixPath))
}

function collectProjectMetadata(
  root: string,
  packageJson: IPackageJson,
  configFiles: string[],
  configText: string,
  taroConfigText: string,
  framework: IProjectFacts['framework']
): IProjectFacts {
  return {
    root,
    ...(packageJson.name ? { name: packageJson.name } : {}),
    ...(packageJson.version ? { version: packageJson.version } : {}),
    ...(packageJson.private === undefined ? {} : { private: packageJson.private }),
    framework,
    compiler: /compiler\s*:\s*['"]vite['"]/.test(configText) ? 'vite' :
      /compiler\s*:\s*['"]webpack5?['"]/.test(configText) ? 'webpack5' : 'unknown',
    ...readConfigPath(configText, 'sourceRoot'),
    ...readConfigPath(configText, 'outputRoot'),
    configFiles,
    plugins: extractPluginNames(taroConfigText),
  }
}

function readConfigPath(configText: string, key: 'outputRoot' | 'sourceRoot'): Partial<IProjectFacts> {
  const match = configText.match(new RegExp(`${key}\\s*:\\s*['\"]([^'\"]+)['\"]`))
  return match?.[1] ? { [key]: match[1] } : {}
}

async function collectWorkspaceState(
  root: string,
  packageJson: IPackageJson,
  captureRoots: IWorkspaceRoot[] | undefined,
  invocation?: IInvocationFacts
): Promise<IDiscoveredWorkspaceState> {
  const discovery = await discoverWorkspace(root)
  const discoveredState = await buildDiscoveredWorkspaceState(
    discovery,
    packageJson as IWorkspacePackageManifest,
    invocation,
    captureRoots
  )
  if (discoveredState) return discoveredState

  const packageManagerWorkspace = Boolean(packageJson.workspaces) || existsSync(path.join(root, 'pnpm-workspace.yaml'))
  const packageFiles = packageManagerWorkspace ? await findPackageJsonFiles(root) : [path.join(root, 'package.json')]
  const packages: IWorkspacePackageFacts[] = []
  const roots: IWorkspaceRoot[] = [{ rootId: 'project', role: 'project', originalPath: root }]

  for (const packageFile of packageFiles) {
    if (packageFile === path.join(root, 'package.json')) continue
    const manifest = await readPackageJson(packageFile)
    const packageRoot = path.dirname(packageFile)
    const relativePath = toPosixPath(path.relative(root, packageRoot))
    const rootId = `workspace:${digestText(relativePath).slice(7, 19)}`
    packages.push({
      rootId,
      ...(manifest.name ? { name: manifest.name } : {}),
      ...(manifest.version ? { version: manifest.version } : {}),
      relativePath,
      dependencies: uniqueStrings([
        ...Object.keys(manifest.dependencies ?? {}),
        ...Object.keys(manifest.devDependencies ?? {}),
      ]),
    })
    roots.push({ rootId, role: 'workspace-package', originalPath: packageRoot, relativePlacement: relativePath })
  }

  const declared = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
  for (const [name, specifier] of Object.entries(declared)) {
    if (!/^(file|link):/.test(specifier)) continue
    const dependencyRoot = path.resolve(root, specifier.replace(/^(file|link):/, ''))
    if (!existsSync(dependencyRoot)) continue
    const rootId = `local:${digestText(`${name}:${dependencyRoot}`).slice(7, 19)}`
    roots.push({
      rootId,
      role: 'local-dependency',
      originalPath: dependencyRoot,
      relativePlacement: toPosixPath(path.relative(root, dependencyRoot)),
    })
  }

  for (const captureRoot of captureRoots ?? []) {
    if (!roots.some(rootEntry => rootEntry.rootId === captureRoot.rootId || rootEntry.originalPath === captureRoot.originalPath)) {
      roots.push(captureRoot)
    }
  }

  packages.sort((left, right) => left.relativePath.localeCompare(right.relativePath))
  return {
    roots,
    topology: {
      packageManagerWorkspace,
      packages,
    },
    packageManagerRoot: root,
    packageManagerRootId: 'project',
    packageManagerManifest: packageJson as IWorkspacePackageManifest,
    issues: discovery.issues,
  }
}

async function findPackageJsonFiles(root: string): Promise<string[]> {
  const results: string[] = []
  await walk(root)
  results.sort()
  return results

  async function walk(directory: string): Promise<void> {
    const handle = await opendir(directory)
    for await (const entry of handle) {
      if (entry.name === '.git' || entry.name === '.taro-pilot' || entry.name === 'node_modules') continue
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) await walk(absolutePath)
      else if (entry.isFile() && entry.name === 'package.json') results.push(absolutePath)
    }
  }
}

async function collectDependencyFacts(
  root: string,
  packageJson: IPackageJson,
  contentEntries: Array<{ rootId: string, relativePath: string, digest: string }>,
  packageManagerRoot: string,
  packageManagerRootId: string,
  packageManagerManifest: IWorkspacePackageManifest,
  invocation?: IInvocationFacts
): Promise<IDependencyFacts> {
  const packageManager = detectPackageManager(packageManagerRoot, packageManagerManifest, invocation)
  const lockfiles: ILockfileFacts[] = LOCKFILE_CANDIDATES.flatMap(candidate => {
    const entry = contentEntries.find(item => item.rootId === packageManagerRootId && item.relativePath === candidate.relativePath)
    return entry ? [{
      rootId: packageManagerRootId,
      relativePath: candidate.relativePath,
      kind: candidate.kind,
      digest: entry.digest,
      matchesPackageManager: candidate.kind === packageManager,
    }] : []
  })
  const declared = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
  const installedDependencies: Record<string, string> = {}
  const localDependencies: ILocalDependencyFacts[] = []

  for (const [name, specifier] of Object.entries(declared)) {
    const installed = await readPackageJson(path.join(root, 'node_modules', name, 'package.json'))
    if (installed.version) installedDependencies[name] = installed.version
    if (/^(file|link|workspace):/.test(specifier)) {
      const rawPath = specifier.replace(/^(file|link):/, '')
      localDependencies.push({
        name,
        specifier,
        ...(!specifier.startsWith('workspace:') ? { resolvedPath: path.resolve(root, rawPath) } : {}),
      })
    }
  }

  return {
    packageManager,
    ...await readPackageManagerVersion(packageManagerManifest, packageManager),
    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
    installedDependencies,
    lockfiles,
    localDependencies,
  }
}

function detectPackageManager(
  root: string,
  packageJson: IWorkspacePackageManifest,
  invocation?: IInvocationFacts
): TPackageManagerKind {
  const executable = path.basename(invocation?.launcher?.executable ?? '')
  if (executable === 'cnpm' || executable === 'cnpm.cmd') return 'cnpm'
  const declared = packageJson.packageManager?.split('@')[0]
  if (declared === 'cnpm' || declared === 'npm' || declared === 'pnpm' || declared === 'yarn') return declared
  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(path.join(root, 'package-lock.json')) || existsSync(path.join(root, 'npm-shrinkwrap.json'))) return 'npm'
  if (existsSync(path.join(root, 'yarn.lock'))) return 'yarn'
  return 'unknown'
}

async function readPackageManagerVersion(
  packageJson: IWorkspacePackageManifest,
  packageManager: TPackageManagerKind
): Promise<{ packageManagerVersion?: string }> {
  const value = packageJson.packageManager
  if (value) {
    const separator = value.lastIndexOf('@')
    if (separator > 0) return { packageManagerVersion: value.slice(separator + 1) }
  }
  const userAgent = process.env.npm_config_user_agent
  const userAgentMatch = packageManager !== 'unknown' ? userAgent?.match(new RegExp(`${packageManager}/([^\\s]+)`)) : undefined
  if (userAgentMatch?.[1]) return { packageManagerVersion: userAgentMatch[1] }
  if (packageManager === 'unknown') return {}
  try {
    const result = await execFileAsync(packageManager, ['--version'], { encoding: 'utf8', timeout: 5_000 })
    const version = result.stdout.trim()
    return version ? { packageManagerVersion: version } : {}
  } catch {
    return {}
  }
}

async function collectRepositoryFacts(root: string): Promise<IRepositoryFacts | undefined> {
  try {
    const repositoryRoot = (await runGit(root, ['rev-parse', '--show-toplevel'])).trim()
    const [branch, head, remote, status] = await Promise.all([
      runGit(root, ['branch', '--show-current']),
      runGit(root, ['rev-parse', 'HEAD']).catch(() => ''),
      runGit(root, ['config', '--get', 'remote.origin.url']).catch(() => ''),
      runGit(root, ['status', '--porcelain=v1', '-z']),
    ])
    const changedFiles = parseGitStatus(status)
    return {
      root: repositoryRoot,
      ...(branch.trim() ? { branch: branch.trim() } : {}),
      ...(head.trim() ? { head: head.trim() } : {}),
      ...(remote.trim() ? { remote: remote.trim() } : {}),
      dirty: changedFiles.length > 0,
      changedFiles,
    }
  } catch {
    return undefined
  }
}

async function runGit(root: string, args: string[]): Promise<string> {
  const result = await execFileAsync('git', ['-C', root, ...args], { encoding: 'utf8', timeout: 5_000 })
  return result.stdout
}

function parseGitStatus(value: string): IRepositoryChangedFileFacts[] {
  return value.split('\0').filter(Boolean).map(record => ({
    path: toPosixPath(record.slice(3)),
    status: record.slice(0, 2),
    staged: record[0] !== ' ' && record[0] !== '?',
  }))
}

async function collectToolchainFacts(root: string, dependencies: IDependencyFacts): Promise<IToolchainFacts> {
  return {
    node: { name: 'node', version: process.version, path: process.execPath },
    packageManager: {
      name: dependencies.packageManager,
      ...(dependencies.packageManagerVersion ? { version: dependencies.packageManagerVersion } : {}),
    },
    ...await readInstalledTool(root, '@tarojs/cli', 'taroCli'),
    compiler: await firstInstalledTool(root, ['@tarojs/vite-runner', '@tarojs/webpack5-runner']),
    runner: await firstInstalledTool(root, ['@tarojs/vite-runner', '@tarojs/webpack5-runner']),
    platformPlugins: await collectPlatformPluginVersions(root, dependencies),
    operatingSystem: {
      platform: process.platform,
      release: os.release(),
      architecture: process.arch,
    },
  }
}

async function readInstalledTool(
  root: string,
  packageName: string,
  key: 'taroCli'
): Promise<Partial<Pick<IToolchainFacts, 'taroCli'>>> {
  const manifestPath = path.join(root, 'node_modules', packageName, 'package.json')
  const manifest = await readPackageJson(manifestPath)
  return manifest.version ? { [key]: { name: packageName, version: manifest.version, path: manifestPath } } : {}
}

async function firstInstalledTool(root: string, packageNames: string[]): Promise<IToolVersionFacts | undefined> {
  for (const packageName of packageNames) {
    const manifestPath = path.join(root, 'node_modules', packageName, 'package.json')
    const manifest = await readPackageJson(manifestPath)
    if (manifest.version) return { name: packageName, version: manifest.version, path: manifestPath }
  }
  return undefined
}

async function collectPlatformPluginVersions(root: string, dependencies: IDependencyFacts): Promise<IToolVersionFacts[]> {
  const packageNames = uniqueStrings([
    ...Object.keys(dependencies.dependencies),
    ...Object.keys(dependencies.devDependencies),
  ]).filter(name => /plugin-platform|platform-dynamic/.test(name))
  const tools = await Promise.all(packageNames.map(async packageName => {
    const manifestPath = path.join(root, 'node_modules', packageName, 'package.json')
    const manifest = await readPackageJson(manifestPath)
    return { name: packageName, ...(manifest.version ? { version: manifest.version } : {}), path: manifestPath }
  }))
  return tools
}

function collectEnvironmentFacts(roots: IWorkspaceRoot[]): IEnvironmentFacts {
  const variables: IEnvironmentVariableFacts[] = []
  for (const [name, value] of Object.entries(process.env)) {
    if (value === undefined) continue
    if (HOST_VOLATILE_ENV.has(name)) {
      variables.push({ name, kind: 'host-volatile' })
      continue
    }
    if (path.isAbsolute(value)) {
      const mapped = mapPathToRoot(value, roots)
      variables.push({ name, kind: 'path', ...(mapped ? { pathValue: mapped } : {}) })
      continue
    }
    variables.push({ name, kind: 'restorable', value })
  }
  variables.sort((left, right) => left.name.localeCompare(right.name))
  return { variables, files: [] }
}

function mapPathToRoot(value: string, roots: IWorkspaceRoot[]): { rootId: string, relativePath: string } | undefined {
  for (const root of [...roots].sort((left, right) => right.originalPath.length - left.originalPath.length)) {
    const relativePath = path.relative(root.originalPath, value)
    if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
      return { rootId: root.rootId, relativePath: toPosixPath(relativePath) }
    }
  }
  return undefined
}

function detectPlatforms(packageJson: IPackageJson, configuredPlugins: string[]): string[] {
  const platforms = new Set<string>()
  for (const command of Object.values(packageJson.scripts ?? {})) {
    for (const match of command.matchAll(/--type(?:=|\s+)([^\s]+)/gi)) {
      const platform = normalizeTargetPlatform(match[1])
      if (platform) platforms.add(platform)
    }
  }
  for (const plugin of configuredPlugins) {
    const platform = platformFromPlugin(plugin)
    if (platform) platforms.add(platform)
  }
  return ['weapp', 'jd', 'tt', 'swan', 'alipay', 'qq', 'h5', 'dynamic', 'jdharmony_cpp']
    .filter(platform => platforms.has(platform))
}

function normalizeTargetPlatform(value: string | undefined): string | undefined {
  if (!value) return undefined
  const normalized = value.toLowerCase().replaceAll('-', '_')
  if (normalized === 'jdharmony' || normalized === 'harmony' || normalized === 'harmony_cpp') return 'jdharmony_cpp'
  if (['weapp', 'jd', 'tt', 'swan', 'alipay', 'qq', 'h5', 'dynamic', 'jdharmony_cpp'].includes(normalized)) {
    return normalized
  }
  return undefined
}

function platformFromPlugin(plugin: string): string | undefined {
  const normalized = plugin.toLowerCase()
  if (normalized.includes('jdharmony')) return 'jdharmony_cpp'
  if (normalized.includes('dynamic')) return 'dynamic'
  const match = normalized.match(/plugin-platform-(weapp|jd|tt|swan|alipay|qq|h5)$/)
  return match?.[1]
}

function extractPluginNames(configText: string): string[] {
  const names = new Set<string>()
  for (const match of configText.matchAll(/['"]([^'"\r\n]+)['"]/g)) {
    const value = match[1]
    if (value && /^(?:@[a-z0-9_.-]+\/[a-z0-9_.-]*plugin[a-z0-9_.-]*|[a-z0-9_.-]*plugin[a-z0-9_.-]*)$/i.test(value)) {
      names.add(value)
    }
  }
  return [...names]
}

function createCapabilities(overrides: Partial<IFactsCapabilities>): IFactsCapabilities {
  return {
    projectGraph: supported(),
    repository: supported(),
    workspace: supported(),
    dependencies: supported(),
    toolchain: supported(),
    invocation: supported(),
    buildSession: supported(),
    workspaceContent: supported(),
    environment: supported(),
    platform: supported(),
    ...overrides,
  }
}

function supported(): IFactsCapabilityEntry {
  return { status: 'supported' }
}

function degraded(reason: string): IFactsCapabilityEntry {
  return { status: 'degraded', reason }
}

function unsupported(reason: string): IFactsCapabilityEntry {
  return { status: 'unsupported', reason }
}

async function readPackageJson(filePath: string): Promise<IPackageJson> {
  const text = await readText(filePath)
  if (!text) return {}
  try {
    const value = JSON.parse(text) as TJsonValue
    return value && typeof value === 'object' && !Array.isArray(value) ? value as IPackageJson : {}
  } catch {
    return {}
  }
}

async function readText(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return undefined
  }
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort()
}

function digestText(value: string): string {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep)
}
