export const frameworkMeta: Record<string, {
  importFrameworkStatement: string
  frameworkArgs: string
  creator: string
  importFrameworkName: string
  isNeedRawLoader?: boolean
  extraImportForWeb?: string
  execBeforeCreateWebApp?: string
}> = {
  vue: {
    importFrameworkStatement: `
import Vue from 'vue';
`,
    frameworkArgs: 'Vue, config',
    creator: 'createVueApp',
    importFrameworkName: 'Vue',
    isNeedRawLoader: true,
    extraImportForWeb: `
import '@tarojs/components/dist-h5/vue'
`
  },
  vue3: {
    importFrameworkStatement: `
import { h } from 'vue'
`,
    frameworkArgs: 'h, config',
    creator: 'createVue3App',
    importFrameworkName: 'h',
    isNeedRawLoader: true,
    extraImportForWeb: `
import { initVue3Components } from '@tarojs/components/dist-h5/vue3'
`,
    execBeforeCreateWebApp: `
initVue3Components(component)
`
  },
  nerv: {
    importFrameworkStatement: `
import Nerv from 'nervjs';
`,
    frameworkArgs: 'Nerv, Nerv, config',
    creator: 'createReactApp',
    importFrameworkName: 'Nerv'
  },
  react: {
    importFrameworkStatement: `
import * as React from 'react'
import ReactDOM from 'react-dom'
`,
    frameworkArgs: 'React, ReactDOM, config',
    creator: 'createReactApp',
    importFrameworkName: 'React'
  }
}
