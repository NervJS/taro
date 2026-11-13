import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import { FlowItem } from '../src/components/water-flow/flow-item'
import { FlowSection } from '../src/components/water-flow/flow-section'
import { Root } from '../src/components/water-flow/root'
import { Section } from '../src/components/water-flow/section'
import { WaterFlow } from '../src/components/water-flow/water-flow'

import type { Root as ReactRoot } from 'react-dom/client'

let resizeCallback: ((value: { size: { windowWidth: number } }) => void) | undefined
jest.mock('@tarojs/taro', () => {
  const getSystemInfoSync = jest.fn(() => ({ windowWidth: 400, windowHeight: 800 }))
  return {
    __esModule: true,
    default: { getSystemInfoSync },
    getSystemInfoSync,
    getEnv: () => 'WEB',
    nextTick: (callback: () => void) => callback(),
    useResize: (callback: typeof resizeCallback) => { resizeCallback = callback },
  }
})
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
jest.mock('../src/components/water-flow/utils', () => ({
  ...jest.requireActual('../src/components/water-flow/utils'),
  isH5: true,
}))

let mount: HTMLDivElement
let reactRoot: ReactRoot
let model: Root

beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
  const originalRegister = Root.prototype.registerSection
  jest.spyOn(Root.prototype, 'registerSection').mockImplementation(function (this: Root, section: Section) {
    model = this
    return originalRegister.call(this, section)
  })
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const height = this.id === 'test' ? 300 : 100
    return { width: 400, height, top: 0, bottom: height, left: 0, right: 400, x: 0, y: 0, toJSON: () => {} } as DOMRect
  })
  mount = document.createElement('div')
  document.body.appendChild(mount)
  reactRoot = createRoot(mount)
})

afterEach(() => {
  act(() => reactRoot.unmount())
  mount.remove()
  const getSystemInfoSync = (jest.requireMock('@tarojs/taro') as { getSystemInfoSync: jest.Mock }).getSystemInfoSync
  getSystemInfoSync.mockReturnValue({ windowWidth: 400, windowHeight: 800 })
  jest.restoreAllMocks()
})

function renderFlow(column: number, count = 6, autoColumn = false, onColumnChange?: (column: number) => void) {
  act(() => reactRoot.render(
    <WaterFlow id='test' style={{ height: 300 }}>
      <FlowSection id='grid' column={column} autoColumn={autoColumn} onColumnChange={onColumnChange}>
        {Array.from({ length: count }, (_, index) => <FlowItem key={index}>{index}</FlowItem>)}
      </FlowSection>
    </WaterFlow>
  ))
  return model.findSection('grid')!
}

test('reflows the same H5 section on column changes without remounting', () => {
  const section = renderFlow(2)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 2, 4], [1, 3, 5]])
  const previousMap = section.columnMap
  renderFlow(2)
  expect(section.columnMap).toBe(previousMap)
  renderFlow(3)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 3], [1, 4], [2, 5]])
  expect(section.getState().renderRange).toHaveLength(3)
  renderFlow(1)
  expect(section.columnMap).toHaveLength(1)
  expect(section.getState().renderRange).toHaveLength(1)
  expect(model.findSection('grid')).toBe(section)
})

test('remeasures relocated items and updates positions after their height changes', async () => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const section = model?.findSection('grid')
    const height = this.id === 'test' ? 300 : section?.col === 3 && this.id.endsWith('-item-3') ? 180 : 100
    return { width: 400, height, top: 0, bottom: height, left: 0, right: 400, x: 0, y: 0, toJSON: () => {} } as DOMRect
  })
  const section = renderFlow(2, 9)
  expect(section.columnMap[1][1].getState().height).toBe(100)
  await act(async () => {
    renderFlow(3, 9)
    await Promise.resolve()
  })
  expect(section.columnMap[0][1].getState().height).toBe(180)
  expect(section.columnMap[0][2].getState().top).toBe(280)
})

test('finalizes appended items before reflowing and flushes total height', () => {
  const section = renderFlow(2, 3)
  renderFlow(3, 7)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 3, 6], [1, 4], [2, 5]])
  expect(model.getState().scrollHeight).toBe(section.getState().height)
})

test('flushes the new outer height before the next animation frame', () => {
  jest.useFakeTimers()
  try {
    const section = renderFlow(2, 6)
    section.nodes.forEach(node => node.setStateIn('height', 100))
    act(() => model.setStateIn('scrollOffset', 20))
    renderFlow(1, 6)
    expect(section.getState().height).toBe(600)
    expect(model.getState().scrollHeight).toBe(600)
    expect(model.getState().scrollOffset).toBe(20)
  } finally {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})

test('normalizes invalid columns and switches autoColumn immediately', () => {
  const onColumnChange = jest.fn()
  const section = renderFlow(2)
  renderFlow(0)
  expect(section.col).toBe(1)
  renderFlow(Infinity)
  expect(section.col).toBe(1)
  renderFlow(3, 6, true, onColumnChange)
  expect(section.col).toBe(2)
  expect(onColumnChange).toHaveBeenCalledWith(2)
  renderFlow(3, 6, false, onColumnChange)
  expect(section.col).toBe(3)
  expect(onColumnChange).toHaveBeenCalledTimes(1)
})

test('H5 resize flushes height and notifies only changed auto sections', () => {
  const getSystemInfoSync = (jest.requireMock('@tarojs/taro') as { getSystemInfoSync: jest.Mock }).getSystemInfoSync
  const changed = jest.fn()
  const unchanged = jest.fn()
  const render = () => act(() => reactRoot.render(
    <WaterFlow id='test'>
      <FlowSection id='first' autoColumn onColumnChange={changed}><FlowItem>first</FlowItem></FlowSection>
      <FlowSection id='second' autoColumn onColumnChange={unchanged}><FlowItem>second</FlowItem></FlowSection>
    </WaterFlow>
  ))
  render()
  act(() => model.findSection('second')!.reflow(3))
  changed.mockClear()
  unchanged.mockClear()
  getSystemInfoSync.mockReturnValue({ windowWidth: 650, windowHeight: 800 })
  act(() => resizeCallback?.({ size: { windowWidth: 650 } }))
  expect(model.findSection('first')?.col).toBe(3)
  expect(changed).toHaveBeenCalledTimes(1)
  expect(unchanged).not.toHaveBeenCalled()
  expect(model.getState().scrollHeight).toBe(model.sectionRange[1][1])
})

test('ignores the resize payload and follows the live system width', () => {
  const getSystemInfoSync = (jest.requireMock('@tarojs/taro') as { default: { getSystemInfoSync: jest.Mock } }).default.getSystemInfoSync
  getSystemInfoSync.mockReturnValue({ windowWidth: 625, windowHeight: 800 })
  const onColumnChange = jest.fn()
  const section = renderFlow(2, 4, true, onColumnChange)
  expect(section.col).toBe(2)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 2], [1, 3]])
  act(() => resizeCallback?.({ size: { windowWidth: 640 } }))
  expect(section.col).toBe(2)
  expect(onColumnChange).not.toHaveBeenCalled()
  renderFlow(2, 5, true, onColumnChange)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 2, 4], [1, 3]])
  getSystemInfoSync.mockReturnValue({ windowWidth: 900, windowHeight: 800 })
  renderFlow(2, 6, true, onColumnChange)
  expect(section.col).toBe(4)
  expect(section.columnMap.map(nodes => nodes.map(node => node.childIndex))).toEqual([[0, 4], [1, 5], [2], [3]])
  expect(onColumnChange).toHaveBeenCalledTimes(1)
  expect(onColumnChange).toHaveBeenCalledWith(4)
})

test('reflows sections outside the visible range in order', () => {
  const renderSections = (column: number) => act(() => reactRoot.render(
    <WaterFlow id='test' style={{ height: 300 }}>
      <FlowSection id='first' column={column}>
        <FlowItem>first</FlowItem>
      </FlowSection>
      <FlowSection id='second' column={column}>
        <FlowItem>second</FlowItem>
      </FlowSection>
    </WaterFlow>
  ))
  renderSections(2)
  act(() => model.setStateIn('renderRange', [0, 0]))
  renderSections(3)
  expect(model.findSection('first')?.col).toBe(3)
  expect(model.findSection('second')?.col).toBe(3)
  const first = model.findSection('first')!
  const second = model.findSection('second')!
  expect(second.getState().scrollTop).toBe(first.getState().scrollTop + first.maxColumnHeight + first.rowGap)
})

test('warns once for shrink and keeps column changes idempotent in StrictMode', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const renderStrict = (column: number, count: number) => act(() => reactRoot.render(
    <React.StrictMode>
      <WaterFlow id='test' style={{ height: 300 }}>
        <FlowSection id='grid' column={column}>
          {Array.from({ length: count }, (_, index) => <FlowItem key={index}>{index}</FlowItem>)}
        </FlowSection>
      </WaterFlow>
    </React.StrictMode>
  ))
  renderStrict(2, 6)
  const section = model.findSection('grid')!
  renderStrict(3, 3)
  const columnMap = section.columnMap
  renderStrict(3, 3)
  expect(section.columnMap).toBe(columnMap)
  expect(warn).toHaveBeenCalledTimes(1)
})
