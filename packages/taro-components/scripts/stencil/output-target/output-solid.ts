import * as path from 'node:path'

import { dashToPascalCase, normalizePath, relativeImport, sortBy } from '@stencil/react-output-target/dist/utils'

import type {
  ComponentCompilerMeta,
  Config, CopyResults, OutputTargetDist,
} from '@stencil/core/internal'

export const GENERATED_DTS = 'components.d.ts'

export type PartialExcept<T, K extends keyof T> = Partial<T> & { [key in K]: T[key] };

export interface OutputTargetSolid {
  componentCorePackage?: string
  proxiesFile: string
  excludeComponents?: string[]
  directivesProxyFile?: string
  loaderDir?: string
  includePolyfills?: boolean
  includeDefineCustomElements?: boolean
  includeImportCustomElements?: boolean
  customElementsDir?: string
}

export interface ComponentBindingConfig {
  elements: string | string[]
  event: string
  targetProp: string
}

export interface PackageJSON {
  types: string
}

const IMPORT_TYPES = 'JSX'
const REGISTER_CUSTOM_ELEMENTS = 'defineCustomElements'
const APPLY_POLYFILLS = 'applyPolyfills'
const DEFAULT_LOADER_DIR = '/dist/loader'

export const getFilteredComponents = (excludeComponents: string[] = [], components: readonly ComponentCompilerMeta[]): ComponentCompilerMeta[] => {
  return sortBy<ComponentCompilerMeta>(components, (component: ComponentCompilerMeta) => component.tagName).filter(
    (component: ComponentCompilerMeta) => !excludeComponents.includes(component.tagName) && !component.internal,
  )
}

export const getPathToCorePackageLoader = (config: Config, outputTarget: OutputTargetSolid): string => {
  const basePkg = outputTarget.componentCorePackage || ''
  const distOutputTarget = config.outputTargets?.find((o) => o.type === 'dist') as OutputTargetDist

  const distAbsEsmLoaderPath =
    distOutputTarget?.esmLoaderPath && path.isAbsolute(distOutputTarget.esmLoaderPath)
      ? distOutputTarget.esmLoaderPath
      : null

  const distRelEsmLoaderPath =
    config.rootDir && distAbsEsmLoaderPath
      ? path.relative(config.rootDir, distAbsEsmLoaderPath)
      : null

  const loaderDir = outputTarget.loaderDir || distRelEsmLoaderPath || DEFAULT_LOADER_DIR
  return normalizePath(path.join(basePkg, loaderDir))
}

export function createComponentDefinition(componentCompilerMeta: PartialExcept<ComponentCompilerMeta, 'tagName'>, includeImportCustomElements = false): readonly string[] {
  const tagNameAsPascal = dashToPascalCase(componentCompilerMeta.tagName)
  let template = `export const ${tagNameAsPascal} = /*@__PURE__*/createSolidComponent<${IMPORT_TYPES}.${tagNameAsPascal}, HTML${tagNameAsPascal}Element>('${componentCompilerMeta.tagName}'`

  if (includeImportCustomElements) {
    template += `, undefined, define${tagNameAsPascal}`
  }

  template += `);`

  return [
    template,
  ]
}

export const generateProxies = (config: Config, components: ComponentCompilerMeta[], pkgData: PackageJSON, outputTarget: OutputTargetSolid, rootDir: string): string => {
  const distTypesDir = path.dirname(pkgData.types)
  const dtsFilePath = path.join(rootDir, distTypesDir, GENERATED_DTS)
  const componentsTypeFile = relativeImport(outputTarget.proxiesFile, dtsFilePath, '.d.ts')
  const pathToCorePackageLoader = getPathToCorePackageLoader(config, outputTarget)

  const imports = `/* eslint-disable */
/* tslint:disable */
/* auto-generated solid proxies */
import { createSolidComponent } from './solid-component-lib';\n`

  const generateTypeImports = () => {
    if (outputTarget.componentCorePackage !== undefined) {
      const dirPath = outputTarget.includeImportCustomElements ? `/${outputTarget.customElementsDir || 'components'}` : ''
      return `import type { ${IMPORT_TYPES} } from '${normalizePath(outputTarget.componentCorePackage)}${dirPath}';\n`
    }

    return `import type { ${IMPORT_TYPES} } from '${normalizePath(componentsTypeFile)}';\n`
  }

  const typeImports = generateTypeImports()

  let sourceImports = ''
  let registerCustomElements = ''

  if (outputTarget.includeImportCustomElements && outputTarget.componentCorePackage !== undefined) {
    const componentImports = components.map(component => {
      const pascalImport = dashToPascalCase(component.tagName)

      return `import { defineCustomElement as define${pascalImport} } from '${normalizePath(outputTarget.componentCorePackage!)}/${outputTarget.customElementsDir ||
      'components'
      }/${component.tagName}.js';`
    })

    sourceImports = componentImports.join('\n')
  } else if (outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
    sourceImports = `import { ${APPLY_POLYFILLS}, ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`
    registerCustomElements = `${APPLY_POLYFILLS}().then(() => ${REGISTER_CUSTOM_ELEMENTS}());`
  } else if (!outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
    sourceImports = `import { ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`

    registerCustomElements = `${REGISTER_CUSTOM_ELEMENTS}();`
  }

  return [
    imports,
    typeImports,
    sourceImports,
    registerCustomElements,
    components.map(cmpMeta => createComponentDefinition(cmpMeta, outputTarget.includeImportCustomElements)).join('\n'),
  ].join('\n') + '\n'
}

export const copyResources = async (config: Config, outputTarget: OutputTargetSolid): Promise<CopyResults> => {
  if (!config.sys || !config.sys.copy || !config.sys.glob) {
    throw new Error('stencil is not properly initialized at this step. Notify the developer')
  }
  const srcDirectory = path.join(__dirname, 'solid-component-lib')
  const destDirectory = path.join(path.dirname(outputTarget.proxiesFile), 'solid-component-lib')

  return config.sys.copy(
    [
      {
        src: srcDirectory,
        dest: destDirectory,
        keepDirStructure: false,
        warn: false,
      },
    ],
    srcDirectory,
  )
}

export const validateOutputTarget = (config: Config, outputTarget: OutputTargetSolid): void => {
  if (config.rootDir == null) {
    throw new Error('rootDir is not set and it should be set by stencil itself')
  }

  if (outputTarget.proxiesFile == null) {
    throw new Error('proxiesFile is required')
  }

  if (outputTarget.includeDefineCustomElements && outputTarget.includeImportCustomElements) {
    throw new Error('includeDefineCustomElements cannot be used at the same time as includeImportCustomElements since includeDefineCustomElements is used for lazy loading components. Set `includeDefineCustomElements: false` in your React output target config to resolve this.')
  }

  if (outputTarget.includeImportCustomElements && outputTarget.includePolyfills) {
    throw new Error('includePolyfills cannot be used at the same time as includeImportCustomElements. Set `includePolyfills: false` in your React output target config to resolve this.')
  }
}

export const normalizeOutputTarget = (config: Config, outputTarget: OutputTargetSolid, validate = true) => {
  if (validate) {
    validateOutputTarget(config, outputTarget)
  }

  const results: OutputTargetSolid = {
    ...outputTarget,
    excludeComponents: outputTarget.excludeComponents || [],
    includePolyfills: outputTarget.includePolyfills ?? true,
    includeDefineCustomElements: outputTarget.includeDefineCustomElements ?? true,
  }

  if (outputTarget.directivesProxyFile && !path.isAbsolute(outputTarget.directivesProxyFile)) {
    results.proxiesFile = normalizePath(path.join(config.rootDir!, outputTarget.proxiesFile))
  }

  return results
}
