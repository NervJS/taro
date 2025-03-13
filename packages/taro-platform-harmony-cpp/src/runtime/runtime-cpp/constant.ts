export * from '@tarojs/runtime/dist/constants'

export const ATTRIBUTES_CALLBACK_TRIGGER_MAP = {
  focus: {
    triggerName: 'focus',
  },
  animation: {
    triggerName: 'animation',
  }
}

/** Harmony Constant for JSVM */

export enum BorderStyle {
  /**
   * Displays as a series of dots with a radius of half the borderWidth.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Displays as a series of dots with a radius of half the borderWidth.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Displays as a series of dots with a radius of half the borderWidth.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Displays as a series of dots with a radius of half the borderWidth.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Dotted,
  /**
   * Shows as a series of short square dashed lines.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Shows as a series of short square dashed lines.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Shows as a series of short square dashed lines.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Shows as a series of short square dashed lines.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Dashed,
  /**
   * Shows as a solid line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Shows as a solid line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Shows as a solid line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Shows as a solid line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Solid
}

export enum FlexWrap {
  /**
   * The Flex container has a single row/column layout of elements, and children are allowed to go beyond the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The Flex container has a single row/column layout of elements, and children are allowed to go beyond the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The Flex container has a single row/column layout of elements, and children are allowed to go beyond the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The Flex container has a single row/column layout of elements, and children are allowed to go beyond the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  NoWrap,
  /**
   * The elements of the Flex container are arranged in multiple rows or columns, and the sub-items are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The elements of the Flex container are arranged in multiple rows or columns, and the sub-items are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The elements of the Flex container are arranged in multiple rows or columns, and the sub-items are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The elements of the Flex container are arranged in multiple rows or columns, and the sub-items are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Wrap,
  /**
   * The elements of the Flex container are arranged in reverse multiple rows/columns, and children are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The elements of the Flex container are arranged in reverse multiple rows/columns, and children are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The elements of the Flex container are arranged in reverse multiple rows/columns, and children are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The elements of the Flex container are arranged in reverse multiple rows/columns, and children are allowed to exceed the container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  WrapReverse
}

export enum ItemAlign {
  /**
   * Use the default configuration in the Flex container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Use the default configuration in the Flex container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Use the default configuration in the Flex container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Use the default configuration in the Flex container.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Auto,
  /**
   * The element is in the Flex container with the cross-axis direction head aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The element is in the Flex container with the cross-axis direction head aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The element is in the Flex container with the cross-axis direction head aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The element is in the Flex container with the cross-axis direction head aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Start,
  /**
   * The element is centered in the Flex container with the cross axis direction aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The element is centered in the Flex container with the cross axis direction aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The element is centered in the Flex container with the cross axis direction aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The element is centered in the Flex container with the cross axis direction aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Center,
  /**
   * The element is bottom aligned in the Flex container with the cross axis direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The element is bottom aligned in the Flex container with the cross axis direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The element is bottom aligned in the Flex container with the cross axis direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The element is bottom aligned in the Flex container with the cross axis direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  End,
  /**
   * Element In the Flex container, the cross-axis direction text baseline is aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Element In the Flex container, the cross-axis direction text baseline is aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Element In the Flex container, the cross-axis direction text baseline is aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Element In the Flex container, the cross-axis direction text baseline is aligned.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Baseline,
  /**
   * Element In a Flex container, the fill is stretched across the axis and, when no dimension is set, to the container size.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Element In a Flex container, the fill is stretched across the axis and, when no dimension is set, to the container size.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Element In a Flex container, the fill is stretched across the axis and, when no dimension is set, to the container size.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Element In a Flex container, the fill is stretched across the axis and, when no dimension is set, to the container size.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Stretch
}

export enum FlexAlign {
  /**
   * The element is aligned at the head of the principal axis,
   * the first element is aligned with the head of the row, and subsequent elements are aligned with the previous one.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The element is aligned at the head of the principal axis,
   * the first element is aligned with the head of the row, and subsequent elements are aligned with the previous one.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The element is aligned at the head of the principal axis,
   * the first element is aligned with the head of the row, and subsequent elements are aligned with the previous one.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The element is aligned at the head of the principal axis,
   * the first element is aligned with the head of the row, and subsequent elements are aligned with the previous one.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Start,
  /**
   * The elements are centered in the direction of the principal axis,
   * and the first element is the same distance from the beginning of the row as the last element is from the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The elements are centered in the direction of the principal axis,
   * and the first element is the same distance from the beginning of the row as the last element is from the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The elements are centered in the direction of the principal axis,
   * and the first element is the same distance from the beginning of the row as the last element is from the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The elements are centered in the direction of the principal axis,
   * and the first element is the same distance from the beginning of the row as the last element is from the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Center,
  /**
   * The element is aligned at the tail of the principal axis,
   * the last element is aligned at the end of the row, and the other elements are aligned with the next.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The element is aligned at the tail of the principal axis,
   * the last element is aligned at the end of the row, and the other elements are aligned with the next.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The element is aligned at the tail of the principal axis,
   * the last element is aligned at the end of the row, and the other elements are aligned with the next.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The element is aligned at the tail of the principal axis,
   * the last element is aligned at the end of the row, and the other elements are aligned with the next.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  End,
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   * with the same distance between adjacent elements.
   * The first element aligns with the beginning of the line, and the last element aligns with the end of the line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   * with the same distance between adjacent elements.
   * The first element aligns with the beginning of the line, and the last element aligns with the end of the line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   * with the same distance between adjacent elements.
   * The first element aligns with the beginning of the line, and the last element aligns with the end of the line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   * with the same distance between adjacent elements.
   * The first element aligns with the beginning of the line, and the last element aligns with the end of the line.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  SpaceBetween,
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   *  with the same distance between adjacent elements. Half the distance between adjacent elements as the distance between
   * the first element and the distance between the last element and the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   *  with the same distance between adjacent elements. Half the distance between adjacent elements as the distance between
   * the first element and the distance between the last element and the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   *  with the same distance between adjacent elements. Half the distance between adjacent elements as the distance between
   * the first element and the distance between the last element and the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Elastic elements are evenly distributed in the direction of the Flex principal axis,
   *  with the same distance between adjacent elements. Half the distance between adjacent elements as the distance between
   * the first element and the distance between the last element and the end of the row.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  SpaceAround,
  /**
   * Elements in the Flex axis direction are evenly spaced.
   * The spacing between adjacent elements, the spacing between the first element and the beginning of the row,
   * and the spacing between the last element and the end of the row are the same.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Elements in the Flex axis direction are evenly spaced.
   * The spacing between adjacent elements, the spacing between the first element and the beginning of the row,
   * and the spacing between the last element and the end of the row are the same.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Elements in the Flex axis direction are evenly spaced.
   * The spacing between adjacent elements, the spacing between the first element and the beginning of the row,
   * and the spacing between the last element and the end of the row are the same.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Elements in the Flex axis direction are evenly spaced.
   * The spacing between adjacent elements, the spacing between the first element and the beginning of the row,
   * and the spacing between the last element and the end of the row are the same.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  SpaceEvenly
}

export enum FlexDirection {
  /**
   * The main axis is consistent with the row direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The main axis is consistent with the row direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The main axis is consistent with the row direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The main axis is consistent with the row direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Row,
  /**
   * The main axis is consistent with the column direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The main axis is consistent with the column direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The main axis is consistent with the column direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The main axis is consistent with the column direction as the layout mode.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  Column,
  /**
   * The layout is in the opposite direction to the Row direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * The layout is in the opposite direction to the Row direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * The layout is in the opposite direction to the Row direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * The layout is in the opposite direction to the Row direction.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  RowReverse,
  /**
   * Layout in the opposite direction to the column.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @since 7
   */
  /**
   * Layout in the opposite direction to the column.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @form
   * @since 9
   */
  /**
   * Layout in the opposite direction to the column.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @since 10
   */
  /**
   * Layout in the opposite direction to the column.
   *
   * @syscap SystemCapability.ArkUI.ArkUI.Full
   * @crossplatform
   * @form
   * @atomicservice
   * @since 11
   */
  ColumnReverse
}
