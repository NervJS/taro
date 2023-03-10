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

// import React, { Component } from 'react'
// import View from '../View'
// import { ControlsProps } from './PropsType'
// import { formatTime } from './utils'
// import Styles from './style'
// import Image from '../Image'
// /**
//  * @typedef {Object} ControlsProps
//  * @property {Boolean} controls={controls}
//  * @property {Number} currentTime={this.currentTime}
//  * @property {Number} duration={this.state.duration}
//  * @property {Boolean} isPlaying={this.state.isPlaying}
//  * @property {Function} pauseFunc={this.pause}
//  * @property {Function} playFunc={this.play}
//  * @property {Function} seekFunc={this.seek}
//  * @property {Boolean} showPlayBtn={showPlayBtn}
//  * @property {Boolean} showProgress={showProgress}
//  */
// class Controls extends Component<ControlsProps, any> {
//   visible = false
//   isDraggingProgressBall = false

//   /** @type {number} */
//   hideControlsTimer

//   progressDimentions = {
//     left: 0,
//     right: 0,
//     width: 0
//   }

//   calcPercentage = pageX => {
//     let pos = pageX - this.progressDimentions.left
//     pos = Math.max(pos, 0)
//     pos = Math.min(pos, this.progressDimentions.width)
//     return pos / this.progressDimentions.width
//   }

//   getControlsRef = ref => {
//     if (!ref) return
//     this.controlsRef = ref
//   }
//   getCurrentTimeRef = ref => {
//     if (!ref) return
//     this.currentTimeRef = ref
//   }
//   getProgressBallRef = ref => {
//     if (!ref) return
//     this.progressBallRef = ref
//   }

//   setCurrentTime (time) {
//     if (this.currentTimeRef) {
//       this.currentTimeRef.innerHTML = formatTime(time)
//     }
//   }
//   setProgressBall (percentage) {
//     if (this.progressBallRef) {
//       this.progressBallRef.style.left = `${percentage * 100}%`
//     }
//   }

//   toggleVisibility (nextVisible) {
//     const visible = nextVisible === undefined ? !this.visible : nextVisible
//     if (visible) {
//       this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
//       if (this.props.isPlaying) {
//         this.hideControlsTimer = setTimeout(() => {
//           this.toggleVisibility(false)
//         }, 2000)
//       }
//       if (this.controlsRef) {
//         this.controlsRef.style.visibility = 'visible'
//       }
//     } else {
//       if (this.controlsRef) {
//         this.controlsRef.style.visibility = 'hidden'
//       }
//     }
//     this.visible = !!visible
//   }

//   onDragProgressBallStart = () => {
//     this.isDraggingProgressBall = true
//     this.hideControlsTimer && clearTimeout(this.hideControlsTimer)
//   }
//   onClickProgress = e => {
//     e.stopPropagation()
//     const seekFunc = this.props.seekFunc
//     const percentage = this.calcPercentage(e.pageX)
//     seekFunc(percentage * this.props.duration)
//     this.toggleVisibility(true)
//   }
//   bindTouchEvents = () => {
//     let percentage = 0
//     const touchMove = e => {
//       if (!this.isDraggingProgressBall) return
//       const touchX = e.touches[0].pageX
//       percentage = this.calcPercentage(touchX)
//       this.setProgressBall(percentage)
//     }
//     const touchEnd = e => {
//       if (!this.isDraggingProgressBall) return
//       const seekFunc = this.props.seekFunc
//       this.isDraggingProgressBall = false
//       seekFunc(percentage * this.props.duration)
//       this.toggleVisibility(true)
//     }

//     // document.body.addEventListener('touchmove', touchMove)
//     // document.body.addEventListener('touchend', touchEnd)
//     // document.body.addEventListener('touchcancel', touchEnd)
//     // return () => {
//     //   document.body.removeEventListener('touchmove', touchMove)
//     //   document.body.removeEventListener('touchend', touchEnd)
//     //   document.body.removeEventListener('touchcancel', touchEnd)
//     // }
//   }

//   componentDidMount () {
//     // this.unbindTouchEvents = this.bindTouchEvents()
//   }
//   componentWillUnmount () {
//     // this.unbindTouchEvents()
//   }

//   render () {
//     const { controls, currentTime, duration, isPlaying, pauseFunc, playFunc, showPlayBtn, showProgress } = this.props
//     const formattedDuration = formatTime(duration as number)
//     let playBtn

//     if (!showPlayBtn) {
//       return null
//     } else if (isPlaying) {
//       playBtn = <Image src={require('../../assets/video/play.png')} style={[Styles['taro-video-control-button'], Styles['taro-video-control-button-pause']]} onClick={pauseFunc} />;
//     } else {
//       playBtn = <Image src={require('../../assets/video/play.png')} style={[Styles['taro-video-control-button'], Styles['taro-video-control-button-pause']]} onClick={pauseFunc} />;
//     }

//     return (
//       <View style={[Styles['taro-video-bar'], Styles['taro-video-bar-full']]} ref={this.getControlsRef}>
//         {controls && (
//           <View style={Styles['taro-video-controls']}>
//             {playBtn}
//             {showProgress && (
//               <View style={Styles['taro-video-current-time']} ref={this.getCurrentTimeRef}>
//                 {formatTime(currentTime as number)}
//               </View>
//             )}
//             {showProgress && (
//               <View style={Styles['taro-video-progress-container']} onClick={this.onClickProgress}>
//                 <View
//                   style={Styles['taro-video-progress']}
//                   ref={ref => {
//                     // if (ref !== null) {
//                     //   const rect = ref.getBoundingClientRect()
//                     //   this.progressDimentions.left = rect.left
//                     //   this.progressDimentions.right = rect.right
//                     //   this.progressDimentions.width = rect.width
//                     // }
//                   }}>
//                   <View style={Styles['taro-video-progress-buffered']} style={{ width: '100%' }} />
//                   <View style={Styles['taro-video-ball']} ref={this.getProgressBallRef} onTouchStart={this.onDragProgressBallStart} style={`left: ${formattedDuration ? (this.currentTime / duration) * 100 : 0}%`}>
//                     <View style={Styles['taro-video-inner']} />
//                   </View>
//                 </View>
//               </View>
//             )}
//             {showProgress && <View style={Styles['taro-video-duration']}>{formattedDuration}</View>}
//           </View>
//         )}
//         {this.props.children}
//       </View>
//     )
//   }
// }

// export default Controls
