import { h } from '@stencil/core'
import React from 'react'

import coreMappings from '../../ascf-mappings/core.json'

const ASCF_MAPPINGS = {
  ...coreMappings
}

export function withAscfAdapter<T extends IntrinsicAttributes & T>(WrappedComponent: React.ComponentType<T>) {
  const componentName = WrappedComponent.name
  const mapping = ASCF_MAPPINGS[componentName] || {}

  // eslint-disable-next-line react/display-name
  return (props: T) => {
    if (process.env.TARO_ENV !== 'ascf') {
      return <WrappedComponent {...props} />
    }

    const ascfProps: any = {}

    Object.entries(props).forEach(([key, value]) => {
      const propMapping = mapping[key]

      if (propMapping) {
        ascfProps[propMapping.ascfProp] = propMapping.valueMap
          ? propMapping.valueMap[value] ?? value
          : value
      } else {
        ascfProps[key] = value
      }
    })

    Object.entries(mapping).forEach(([, config]) => {
      const ascfKey = config.ascfProp
      if (ascfProps[ascfKey] === undefined && config.default !== undefined) {
        ascfProps[ascfKey] = config.default
      }
    })

    return <WrappedComponent {...ascfProps} />
  }
}
