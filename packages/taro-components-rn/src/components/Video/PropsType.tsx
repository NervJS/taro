import { VideoProps } from '@tarojs/components/types/Video'
import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export interface ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface onFullscreenChangeEventDetail extends VideoProps.onFullscreenChangeEventDetail {
  fullscreenUpdate: 0 | 1 | 2 | 3;
}

export interface ControlsProps {
  controls?: boolean;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  pauseFunc?: () => void;
  playFunc?: () => void;
  seekFunc?: () => void;
  showPlayBtn?: boolean;
  showProgress?: boolean;
}
