/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
