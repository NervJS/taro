import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import { FlowItem } from '../src/components/water-flow/flow-item'
import { FlowSection } from '../src/components/water-flow/flow-section'
import { Root } from '../src/components/water-flow/root'
import { WaterFlow } from '../src/components/water-flow/water-flow'

let resizeCallback: ((value: { size: { windowWidth: number } }) => void) | undefined
jest.mock('@tarojs/taro', () => ({
  __esModule: true,
  default: { getSystemInfoSync: () => ({ windowWidth: 400, windowHeight: 800 }) },
  getSystemInfoSync: () => ({ windowWidth: 400, windowHeight: 800 }),
  getEnv: () => 'WEB',
  nextTick: (callback: () => void) => callback(),
  useResize: (callback: typeof resizeCallback) => { resizeCallback = callback },
}))
jest.mock('@tarojs/runtime', () => ({
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(callback, 0),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  document: { getElementById: jest.fn() },
}))
jest.mock('@tarojs/components', () => {
  const View = React.forwardRef(function View(props: any, ref: any) { return <div {...props} ref={ref} /> })
  const ScrollView = React.forwardRef(function ScrollView({ scrollY: _scrollY, ...props }: any, ref: any) { return <div {...props} ref={ref} /> })
  return { View, ScrollView }
}, { virtual: true })
jest.mock('../src/utils/scrollElementContext', () => ({
  ScrollElementContextOrFallback: jest.requireActual('react').createContext(null),
}))

test('does not reflow manual column updates on non-H5 platforms', () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
  const originalRegister = Root.prototype.registerSection
  let model: Root
  const register = jest.spyOn(Root.prototype, 'registerSection').mockImplementation(function (this: Root, section) {
    model = this
    return originalRegister.call(this, section)
  })
  const measure = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 400, height: 300, top: 0, bottom: 300, left: 0, right: 400, x: 0, y: 0, toJSON: () => {},
  })
  const mount = document.createElement('div')
  document.body.appendChild(mount)
  const reactRoot = createRoot(mount)
  const render = (column: number) => act(() => reactRoot.render(
    <WaterFlow id='platform-test'>
      <FlowSection id='grid' column={column}><FlowItem>item</FlowItem></FlowSection>
    </WaterFlow>
  ))
  try {
    render(2)
    render(3)
    expect(model!.findSection('grid')?.col).toBe(2)
  } finally {
    act(() => reactRoot.unmount())
    mount.remove()
    register.mockRestore()
    measure.mockRestore()
  }
})

test('preserves non-H5 resize notifications for all auto sections', () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
  const originalRegister = Root.prototype.registerSection
  let model: Root
  const register = jest.spyOn(Root.prototype, 'registerSection').mockImplementation(function (this: Root, section) {
    model = this
    return originalRegister.call(this, section)
  })
  const mount = document.createElement('div')
  document.body.appendChild(mount)
  const reactRoot = createRoot(mount)
  const firstChange = jest.fn()
  const secondChange = jest.fn()
  try {
    act(() => reactRoot.render(
      <WaterFlow id='platform-resize'>
        <FlowSection id='first' autoColumn onColumnChange={firstChange}><FlowItem>first</FlowItem></FlowSection>
        <FlowSection id='second' autoColumn onColumnChange={secondChange}><FlowItem>second</FlowItem></FlowSection>
      </WaterFlow>
    ))
    act(() => model!.findSection('second')!.reflow(3))
    act(() => resizeCallback?.({ size: { windowWidth: 640 } }))
    expect(model!.findSection('first')?.col).toBe(3)
    expect(firstChange).toHaveBeenCalledWith(3)
    expect(secondChange).toHaveBeenCalledWith(3)
  } finally {
    act(() => reactRoot.unmount())
    mount.remove()
    register.mockRestore()
  }
})
