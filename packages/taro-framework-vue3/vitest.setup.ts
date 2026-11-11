import { document, navigator, ShadowRoot, SVGElement, TaroDocument, TaroElement, window } from '@tarojs/runtime'
import { vi } from 'vitest'

// 设置全局对象
vi.stubGlobal('document', document)
vi.stubGlobal('window', window)
vi.stubGlobal('navigator', navigator)
vi.stubGlobal('Element', TaroElement)
vi.stubGlobal('Document', TaroDocument)
vi.stubGlobal('ShadowRoot', ShadowRoot)
vi.stubGlobal('SVGElement', SVGElement)
