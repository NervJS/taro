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
  importFramework: string
  frameworkArgs: string
  creator: string
}> = {
  vue: {
    importFramework: `
import Vue from 'vue';
`,
    frameworkArgs: 'Vue, config',
    creator: 'createVueApp'
  },
  vue3: {
    importFramework: `
import { h } from 'vue'
`,
    frameworkArgs: 'h, config',
    creator: 'createVue3App'
  },
  nerv: {
    importFramework: `
import Nerv from 'nervjs';
`,
    frameworkArgs: 'Nerv, Nerv, config',
    creator: 'createReactApp'
  },
  react: {
    importFramework: `
import * as React from 'react'
import ReactDOM from 'react-dom'
`,
    frameworkArgs: 'React, ReactDOM, config',
    creator: 'createReactApp'
  }
}
