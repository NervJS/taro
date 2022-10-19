import * as assert from 'assert'
import React from 'react'
import ReactDOM from 'react-dom'
import * as sinon from 'sinon'

import {
  Ad,
  AdCustom,
  Camera,
  Editor,
  FunctionalPageNavigator,
  KeyboardAccessory,
  LivePlayer,
  LivePusher,
  Map,
  MatchMedia,
  NavigationBar,
  OfficialAccount,
  OpenData,
  PageContainer,
  PageMeta,
  RootPortal,
  ShareElement,
  VoipRoom
} from '../h5/react'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('unimplemented', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  let warning = ''

  function toCamelCase (s) {
    let camel = ''
    let nextCap = false
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '-') {
        camel += nextCap ? s[i].toUpperCase() : s[i]
        nextCap = false
      } else {
        nextCap = true
      }
    }
    return camel
  }

  function capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function buildWarning (ref) {
    return `H5 暂不支持 ${capitalize(toCamelCase(ref.current.nodeName.slice(5).replace('-CORE', '').toLowerCase()))} 组件！`
  }

  async function testComponent (Comp) {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <Comp ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  }

  beforeAll(() => {
    sinon.stub(console, 'error').callsFake(msg => {
      warning = msg
    })
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  afterAll(() => {
    console.error.restore()
  })

  it('Ad', async () => {
    await testComponent(Ad)
  })

  it('AdCustom', async () => {
    await testComponent(AdCustom)
  })

  it('Camera', async () => {
    await testComponent(Camera)
  })

  it('Editor', async () => {
    await testComponent(Editor)
  })

  it('FunctionalPageNavigator', async () => {
    await testComponent(FunctionalPageNavigator)
  })

  it('KeyboardAccessory', async () => {
    await testComponent(KeyboardAccessory)
  })

  it('LivePlayer', async () => {
    await testComponent(LivePlayer)
  })

  it('LivePusher', async () => {
    await testComponent(LivePusher)
  })

  it('Map', async () => {
    await testComponent(Map)
  })

  it('MatchMedia', async () => {
    await testComponent(MatchMedia)
  })

  it('NavigationBar', async () => {
    await testComponent(NavigationBar)
  })

  it('OfficialAccount', async () => {
    await testComponent(OfficialAccount)
  })

  it('OpenData', async () => {
    await testComponent(OpenData)
  })

  it('PageContainer', async () => {
    await testComponent(PageContainer)
  })

  it('PageMeta', async () => {
    await testComponent(PageMeta)
  })

  it('RootPortal', async () => {
    await testComponent(RootPortal)
  })

  it('ShareElement', async () => {
    await testComponent(ShareElement)
  })

  it('VoipRoom', async () => {
    await testComponent(VoipRoom)
  })
})
