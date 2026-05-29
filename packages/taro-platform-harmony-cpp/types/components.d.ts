import '@tarojs/components'
import { ComponentType } from 'react'
import { StandardProps } from '@tarojs/components/types/common'
import { ScrollViewProps } from '@tarojs/components/types/ScrollView'

declare module '@tarojs/components/types/props' {
  export interface ImageProps {
    // 本地占位图
    placeHolder?: any
    // 本地兜底图
    errorHolder?: any
  }

  interface ListProps extends StandardProps {
    stickyHeader?: boolean
  }

  export interface ListItemProps extends StandardProps {
    space?: number
  }

  export interface FlowItemProps extends StandardProps {
    reuseId?: string
  }

  export interface WaterFlowProps extends ScrollViewProps {
    cacheCount?: number
    lowerThresholdCount?: number
    upperThresholdCount?: number
  }

  export interface FlowSectionProps extends StandardProps {
    column?: number
    rowGap?: number | string
    columnGap?: number | string
    margin?: {
      marginTop?: number | string
      marginRight?: number | string
      marginBottom?: number | string
      marginLeft?: number | string
    }
  }

  export const List: ComponentType<ListProps>
  export const ListItem: ComponentType<ListItemProps>
  export const FlowItem: ComponentType<FlowItemProps>
  export const WaterFlow: ComponentType<WaterFlowProps>
  export const FlowSection: ComponentType<FlowSectionProps>
}
