import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { Entypo, Foundation, MaterialIcons } from '@expo/vector-icons'

const ICON_COLOR = '#FFFFFF'
const CENTER_ICON_SIZE = 36
const BOTTOM_BAR_ICON_SIZE = 30

export const PlayIcon = () =>
  <Entypo
    name={'controller-play'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />

export const PauseIcon = () =>
  <Entypo
    name={'controller-paus'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />

export const Spinner = () =>
  <ActivityIndicator color={ICON_COLOR} size={'large'} />

export const FullscreenEnterIcon = () =>
  <MaterialIcons
    name={'fullscreen'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />

export const FullscreenExitIcon = () =>
  <MaterialIcons
    name={'fullscreen-exit'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />
