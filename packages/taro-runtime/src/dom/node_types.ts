import type { ValueOf } from '@tarojs/shared'

// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
export const NodeType = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
} as const
export type NodeType = ValueOf<typeof NodeType>;
