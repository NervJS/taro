import { GENERATED_DTS, getPathToCorePackageLoader } from '@stencil/vue-output-target/dist/output-vue'
import { dashToPascalCase, normalizePath, relativeImport } from '@stencil/vue-output-target/dist/utils'
import path from 'path'

import { createVue2ComponentDefinition } from './generate-vue2-component'

import type { ComponentCompilerMeta, Config } from '@stencil/core/internal'
import type { OutputTargetVue, PackageJSON } from '@stencil/vue-output-target/dist/types'

const IMPORT_TYPES = 'JSX'
const IMPORT_COMPS_TYPES = 'Components'
const REGISTER_CUSTOM_ELEMENTS = 'defineCustomElements'
const APPLY_POLYFILLS = 'applyPolyfills'

export function generateVue2Proxies (
  config: Config,
  components: ComponentCompilerMeta[],
  pkgData: PackageJSON,
  outputTarget: OutputTargetVue,
  rootDir: string
) {
  const distTypesDir = path.dirname(pkgData.types)
  const dtsFilePath = path.join(rootDir, distTypesDir, GENERATED_DTS)
  const componentsTypeFile = relativeImport(outputTarget.proxiesFile, dtsFilePath, '.d.ts')
  const pathToCorePackageLoader = getPathToCorePackageLoader(config, outputTarget)

  const imports = `/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import Vue, { PropOptions } from 'vue';
import { createCommonRender, createCommonMethod } from './vue-component-lib/utils';\n`

  const generateTypeImports = () => {
    if (outputTarget.componentCorePackage !== undefined) {
      const dirPath = outputTarget.includeImportCustomElements
        ? `/${outputTarget.customElementsDir || 'components'}`
        : ''
      return `import type { ${IMPORT_COMPS_TYPES}, ${IMPORT_TYPES} } from '${normalizePath(outputTarget.componentCorePackage)}${dirPath}';\n`
    }

    return `import type { ${IMPORT_COMPS_TYPES}, ${IMPORT_TYPES} } from '${normalizePath(componentsTypeFile)}';\n`
  }

  const typeImports = generateTypeImports()

  let sourceImports = ''
  let registerCustomElements = ''

  if (outputTarget.includeImportCustomElements && outputTarget.componentCorePackage !== undefined) {
    const cmpImports = components.map((component) => {
      const pascalImport = dashToPascalCase(component.tagName)

      return `import { defineCustomElement as define${pascalImport} } from '${normalizePath(
        outputTarget.componentCorePackage!
      )}/${outputTarget.customElementsDir || 'components'}/${component.tagName}.js';`
    })

    sourceImports = cmpImports.join('\n')
  } else if (outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
    sourceImports = `import { ${APPLY_POLYFILLS}, ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`
    registerCustomElements = `${APPLY_POLYFILLS}().then(() => ${REGISTER_CUSTOM_ELEMENTS}());`
  } else if (!outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
    sourceImports = `import { ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`
    registerCustomElements = `${REGISTER_CUSTOM_ELEMENTS}();`
  }

  const final: string[] = [
    imports,
    typeImports,
    sourceImports,
    registerCustomElements,
    components
      .map(
        createVue2ComponentDefinition([IMPORT_COMPS_TYPES, IMPORT_TYPES], outputTarget.componentModels, outputTarget.includeImportCustomElements)
      )
      .join('\n'),
  ]

  return final.join('\n') + '\n'
}
