import { document, navigator, SVGElement, TaroElement, window } from '@tarojs/runtime'
import { vi } from 'vitest'

// 设置全局对象
vi.stubGlobal('document', document)
vi.stubGlobal('window', window)
vi.stubGlobal('navigator', navigator)
vi.stubGlobal('Element', TaroElement)
vi.stubGlobal('SVGElement', SVGElement)
