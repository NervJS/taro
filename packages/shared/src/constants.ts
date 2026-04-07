export enum PLATFORM_TYPE {
  MINI = 'mini',
  ASCF = 'ascf',
  WEB = 'web',
  RN = 'rn',
  HARMONY = 'harmony',
  QUICK = 'quickapp',
}

export const COMPILE_MODE_IDENTIFIER_PREFIX = 'f'

export const COMPILE_MODE_SUB_RENDER_FN = 'subRenderFn'

export const PLATFORM_CONFIG_MAP = {
  h5: {
    type: PLATFORM_TYPE.WEB
  },
  harmony: {
    type: PLATFORM_TYPE.HARMONY
  },
  ascf: {
    type: PLATFORM_TYPE.ASCF
  },
  mini: {
    type: PLATFORM_TYPE.MINI
  },
  rn: {
    type: PLATFORM_TYPE.RN
  },
  quickapp: {
    type: PLATFORM_TYPE.QUICK
  },
}

export const TT_SPECIFIC_COMPONENTS = new Set([
  'page-container',
  'slot',
  'custom-wrapper',
  'clue-order-form',
  'aweme-group',
  'pay-button',
  'address-area',
  'consume-card',
  'aweme-data',
  'rate-button',
  'store-area',
  'inline-payment-panel',
  'aweme-user-card',
  'aweme-live-book',
  'draw-ad',
  'lynx-view',
  'flow-ad',
  'ai-agent-chat',
  'component'
])

export const DEFAULT_COMPONENTS = new Set<string>([
  'view',
  'scroll-view',
  'swiper',
  'cover-view',
  'cover-image',
  'icon',
  'text',
  'rich-text',
  'progress',
  'button',
  'checkbox',
  'form',
  'input',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'radio-group',
  'checkbox-group',
  'slider',
  'switch',
  'textarea',
  'navigator',
  'audio',
  'image',
  'video',
  'camera',
  'live-player',
  'live-pusher',
  'map',
  'canvas',
  'open-data',
  'web-view',
  'swiper-item',
  'movable-area',
  'movable-view',
  'functional-page-navigator',
  'ad',
  'block',
  'import',
  'official-account',
  'editor'
])

export const UNITLESS_PROPERTIES_SET = new Set([
  'animation-iteration-count',
  'border-image-outset',
  'border-image-slice',
  'border-image-width',
  'box-flex',
  'box-flex-group',
  'box-ordinal-group',
  'column-count',
  'columns',
  'flex',
  'flex-grow',
  'flex-positive',
  'flex-shrink',
  'flex-negative',
  'flex-order',
  'grid-area',
  'grid-row',
  'grid-row-end',
  'grid-row-span',
  'grid-row-start',
  'grid-column',
  'grid-column-end',
  'grid-column-span',
  'grid-column-start',
  'font-weight',
  'line-clamp',
  'line-height',
  'opacity',
  'order',
  'orphans',
  'tab-size',
  'widows',
  'z-index',
  'zoom',
  // SVG-related properties
  'fill-opacity',
  'flood-opacity',
  'stop-opacity',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
])
