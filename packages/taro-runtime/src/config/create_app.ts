import { Component } from 'react'
import { Current } from 'src/current'

export function createAppConfig (render: () => Component) {
  const config = {
    onLaunch () {
      Current.app = render()
    }
  }

  return config
}
