import React, { useState, useEffect, memo } from 'react'
import AsyncComponent from './../utils/asyncComponent'

function TaroRender() {
  const [component, setComponent] = useState({ f: null })
  const template = 'http://storage.jd.local/quark-platform/hl/index.js'

  useEffect(() => {
    const loadComponents = async () => {
      const asyncComponent = new AsyncComponent()
      asyncComponent.getRemoteScripts([template]).then(() => {

        console.log('loadComponents=============');
        const nativeComponent = window.NativeComponent && window.NativeComponent.default || null
        setComponent({ f: nativeComponent })
      })
    }

    loadComponents();
  }, [template])

  console.log('hl component', component)

  // return component.f && React.createElement('div', {}, 'hello') || null
  return component.f && React.createElement(component.f, {
    list: ['a', 'b', 'c'],
    title: 'h5',
    onButtonClick: () => {
      console.log('click')
    }
  }) || React.createElement('div', {}, 'null')
}

export default memo(TaroRender)