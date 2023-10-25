import { generateProxies as generateReactProxies } from '@stencil/react-output-target/dist/output-react'
import { normalizeOutputTarget as normalizeReactOutputTarget } from '@stencil/react-output-target/dist/plugin'
import { generateProxies as generateVue3Proxies } from '@stencil/vue-output-target/dist/output-vue'
import { normalizeOutputTarget as normalizeVueOutputTarget } from '@stencil/vue-output-target/dist/plugin'

import { generateVue2Proxies } from './output-vue2'

import type { CompilerCtx, ComponentCompilerMeta, Config, OutputTargetCustom } from '@stencil/core/internal'
import type { OutputTargetReact } from '@stencil/react-output-target'
import type { OutputTargetVue } from '@stencil/vue-output-target'

export function sortBy<T> (array: ReadonlyArray<T>, prop: (item: T) => string): ReadonlyArray<T> {
  return array.slice().sort((a, b) => {
    const nameA = prop(a)
    const nameB = prop(b)
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}

function getFilteredComponents (
  excludeComponents: ReadonlyArray<string> = [],
  cmpList: ReadonlyArray<ComponentCompilerMeta>
): ReadonlyArray<ComponentCompilerMeta> {
  return sortBy(cmpList, (cmp) => cmp.tagName).filter((c) => !excludeComponents.includes(c.tagName) && !c.internal)
}

export async function reactProxyOutput (
  config: Config,
  compilerCtx: CompilerCtx,
  outputTarget: OutputTargetReact,
  components: ReadonlyArray<ComponentCompilerMeta>
): Promise<void> {
  const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components)
  const rootDir = config.rootDir
  const pkgData = { types: 'dist/index.d.ts' }
  const finalText = generateReactProxies(config, filteredComponents, pkgData, outputTarget, rootDir!)
  await compilerCtx.fs.writeFile(outputTarget.proxiesFile, finalText)
  // await copyResources(config, outputTarget)
}

export async function vue2ProxyOutput (
  config: Config,
  compilerCtx: CompilerCtx,
  outputTarget: OutputTargetVue,
  components: ReadonlyArray<ComponentCompilerMeta>
) {
  const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components) as ComponentCompilerMeta[]
  const rootDir = config.rootDir as string
  const pkgData = { types: 'dist/index.d.ts' }

  const finalText = generateVue2Proxies(config, filteredComponents, pkgData, outputTarget, rootDir)
  await compilerCtx.fs.writeFile(outputTarget.proxiesFile, finalText)
  // await copyResources(config, outputTarget)
}

export async function vue3ProxyOutput (
  config: Config,
  compilerCtx: CompilerCtx,
  outputTarget: OutputTargetVue,
  components: ReadonlyArray<ComponentCompilerMeta>
) {
  const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components) as ComponentCompilerMeta[]
  const rootDir = config.rootDir as string
  const pkgData = { types: 'dist/index.d.ts' }

  const finalText = generateVue3Proxies(config, filteredComponents, pkgData, outputTarget, rootDir)
  await compilerCtx.fs.writeFile(outputTarget.proxiesFile, finalText)
  // await copyResources(config, outputTarget)
}

export const reactOutputTarget = (outputTarget: OutputTargetReact): OutputTargetCustom => ({
  type: 'custom',
  name: 'react-library',
  validate (config) {
    return normalizeReactOutputTarget(config, outputTarget)
  },
  async generator (config, compilerCtx, buildCtx) {
    const timeSpan = buildCtx.createTimeSpan(`generate react started`, true)
    await reactProxyOutput(config, compilerCtx, outputTarget, buildCtx.components)
    timeSpan.finish(`generate react finished`)
  },
})

export const vue2OutputTarget = (outputTarget: OutputTargetVue): OutputTargetCustom => ({
  type: 'custom',
  name: 'vue2-library',
  validate (config) {
    return normalizeVueOutputTarget(config, outputTarget)
  },
  async generator (config, compilerCtx, buildCtx) {
    const timeSpan = buildCtx.createTimeSpan(`generate vue2 started`, true)

    await vue2ProxyOutput(config, compilerCtx, outputTarget, buildCtx.components)

    timeSpan.finish(`generate vue2 finished`)
  },
})

export const vue3OutputTarget = (outputTarget: OutputTargetVue): OutputTargetCustom => ({
  type: 'custom',
  name: 'vue3-library',
  validate (config) {
    return normalizeVueOutputTarget(config, outputTarget)
  },
  async generator (config, compilerCtx, buildCtx) {
    const timeSpan = buildCtx.createTimeSpan(`generate vue3 started`, true)

    await vue3ProxyOutput(config, compilerCtx, outputTarget, buildCtx.components)

    timeSpan.finish(`generate vue3 finished`)
  },
})
