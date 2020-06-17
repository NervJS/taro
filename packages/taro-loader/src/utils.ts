export function importFramework (framework: string) {
  if (framework === 'vue') {
    return `
import Vue from 'vue';
`
  } else if (framework === 'nerv') {
    return `
import Nerv from 'nervjs';
`
  }
  return `
import * as React from 'react'
import ReactDOM from 'react-dom'
`
}

export function getFrameworkArgs (framework: string) {
  if (framework === 'vue') {
    return 'Vue, config'
  } else if (framework === 'nerv') {
    return 'Nerv, Nerv, config'
  }
  return 'React, ReactDOM, config'
}

export const frameworkMeta: Record<string, {
  importFrameworkStatement: string
  frameworkArgs: string
  creator: string
  importFrameworkName: string
}> = {
  vue: {
    importFrameworkStatement: `
import Vue from 'vue';
`,
    frameworkArgs: 'Vue, config',
    creator: 'createVueApp',
    importFrameworkName: 'Vue'
  },
  vue3: {
    importFrameworkStatement: `
import { h } from 'vue'
`,
    frameworkArgs: 'h, config',
    creator: 'createVue3App',
    importFrameworkName: 'h'
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
