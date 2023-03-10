/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  'taro-video': {
    width: '100%',
    height: 225,
    lineHeight: 0,
    overflow: 'hidden',
    position: 'relative'
  },

  'taro-video-container': {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },

  'taro-video-type-fullscreen': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999
  },

  'taro-video-type-rotate-left': {
    transform: [{ translateX: -50 }, { translateY: -50 }, { rotate: '-90deg' }]
  },

  'taro-video-type-rotate-right': {
    transform: [{ translateX: -50 }, { translateY: -50 }, { rotate: '90deg' }]
  },

  'taro-video-video': {
    width: '100%',
    height: '100%'
  },

  'taro-video-cover': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 1
  },

  'taro-video-cover-play-button': {
    width: 30,
    height: 30,
  },

  'taro-video-cover-duration': {
    color: '#fff',
    fontSize: 16,
    marginTop: 10
  },

  'taro-video-bar': {
    height: 44,
    backgroundColor: 'rgba(0,0,0,.5)',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 1
  },

  'taro-video-control-button': {
    width: 13,
    height: 15,
    paddingTop: 14.5,
    paddingRight: 12.5,
    paddingBottom: 14.5,
    paddingLeft: 12.5,
    marginLeft: -8.5,
  },

  'taro-video-bar-full': {
    left: 0
  },

  'taro-videoControls': {
    display: 'flex',
    flexGrow: 1,
    marginLeft: 8.5,
    marginRight: 8.5,
  },

  'taro-videoControl-button': {
    width: 13,
    height: 15,
    padding: '14.5 12.5 14.5 12.5',
    marginLeft: -8.5
  },

  'taro-video-duration': {
    height: 14.5,
    lineHeight: 14.5,
    marginTop: 15,
    marginBottom: 14.5,
    fontSize: 12,
    color: '#cbcbcb'
  },

  'taro-video-progressContainer': {
    flexGrow: 2,
    position: 'relative'
  },

  'taro-video-progress': {
    height: 2,
    margin: 21,
    backgroundColor: 'hsla(0,0%,100%,.4)',
    position: 'relative'
  },

  'taro-video-progress-buffered': {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 0,
    height: '100%',
    backgroundColor: 'hsla(0,0%,100%,.8)'
  },

  'taro-video-ball': {
    width: 16,
    height: 16,
    padding: 14,
    position: 'absolute',
    top: -21,
    left: 0,
    marginLeft: -22
  },

  'taro-videoInner': {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 50
  },

  'taro-video-danmu-button': {
    lineHeight: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    fontSize: 13,
    color: '#fff',
    marginLeft: 8.5,
    marginRight: 8.5,
  },

  'taro-video-danmu-button-active': {
    borderColor: '#48c23d',
    color: '#48c23d'
  },

  'taro-video-mute': {
    width: 17,
    height: 17,
    padding: 8.5,
  },

  'taro-video-danmu': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    marginTop: 14,
    marginBottom: 44,
    fontSize: 14,
    lineHeight: 14,
    overflow: 'visible'
  },

  'taro-video-danmu-item': {
    lineHeight: 1,
    position: 'absolute',
    color: '#fff',
    left: '100%',
    transform: [{ translateX: 0 }]
  },

  'taro-video-toast': {
    // position: 'absolute',
    // left: '50%',
    // top: '50%',
    // transform: [{ translateX: -50 }, {translateY: -50 }],
    // borderRadius: 5,
    // backgroundColor: 'hsla(0,0%,100%,.8)',
    // color: '#000',
  },

  'taro-video-toast-volume': {
    width: 100,
    height: 100
  },

  'taro-video-toast-title': {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 10
  },

  'taro-video-toast-icon': {
    width: '50%',
    height: '50%',
    marginLeft: '25%'
  },

  'taro-video-toast-value': {
    width: 80,
    height: 5,
    marginTop: 5,
    marginLeft: 10
  },

  'taro-video-toast-value-content': {
    overflow: 'hidden'
  },

  'taro-video-toast-volume-grids': {
    width: 80,
    height: 5
  },

  'taro-video-toast-volume-grids-item': {
    width: 7.1,
    height: 5,
    backgroundColor: '#000'
  },

  'taro-video-toast-progress': {
    backgroundColor: 'rgba(0,0,0,.8)',
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    padding: 6
  }
})
