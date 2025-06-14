import type { ValueOf } from '@tarojs/shared'

export const NodeType = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  COMMENT_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  DOCUMENT_NODE: 9
} as const
export type NodeType = ValueOf<typeof NodeType>;
