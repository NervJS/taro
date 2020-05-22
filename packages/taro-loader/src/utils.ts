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
