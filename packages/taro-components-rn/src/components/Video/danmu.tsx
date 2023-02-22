/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team
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

// /* eslint-disable react/react-in-jsx-scope */
// /* eslint-disable no-undef */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import Nerv, { PureComponent } from 'nervjs'

// class Danmu extends PureComponent<any, any> {
//   state = {
//     danmuList: []
//   }

//   danmuList = []
//   danmuElList = []
//   currentTime = 0

//   ensureProperties (danmu) {
//     const clonedDanmu = { ...danmu }
//     if (!('time' in danmu)) {
//       clonedDanmu.time = this.currentTime
//     }
//     clonedDanmu.key = Math.random()
//     clonedDanmu.bottom = `${Math.random() * 90 + 5}%`
//     return clonedDanmu
//   }

//   sendDanmu (danmuList) {
//     if (Array.isArray(danmuList)) {
//       this.danmuList = [
//         ...this.danmuList,
//         ...danmuList.map(danmu => {
//           return this.ensureProperties(danmu)
//         })
//       ]
//     } else {
//       const danmu = danmuList
//       this.danmuList = [
//         ...this.danmuList,
//         { ...this.ensureProperties(danmu) }
//       ]
//     }
//   }

//   tick (currentTime) {
//     this.currentTime = currentTime
//     if (!this.props.enable) return

//     const danmuList = this.danmuList
//     /**
//      * @todo 这个判断对拖拽进度的处理不严谨
//      */
//     const newDanmuList = danmuList.filter(({ time }) => {
//       return currentTime - time < 4 && currentTime > time
//     })
//     let shouldUpdate = false
//     const oldDanmuList = this.state.danmuList

//     if (newDanmuList.length !== oldDanmuList.length) {
//       shouldUpdate = true
//     } else {
//       shouldUpdate = newDanmuList.some(({ key }) => {
//         return oldDanmuList.every((danmu) => {
//           return key !== danmu.key
//         })
//       })
//     }
//     if (shouldUpdate) {
//       this.setState({
//         danmuList: newDanmuList
//       })
//     }
//   }

//   componentDidUpdate () {
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         const danmuElList = this.danmuElList.splice(0)
//         danmuElList.forEach(danmu => {
//           danmu.style.left = 0
//           danmu.style.webkitTransform = 'translateX(-100%)'
//           danmu.style.transform = 'translateX(-100%)'
//         })
//       })
//     })
//   }

//   render () {
//     if (!this.props.enable) return ''
//     return <div className='taro-video-danmu'>
//       {this.state.danmuList.map(({ text, color, bottom, key }) => {
//         return (
//           <p
//             className='taro-video-danmu-item'
//             key={key}
//             style={{
//               color,
//               bottom
//             }}
//             ref={ref => {
//               if (ref) {
//                 this.danmuElList.push(ref)
//               }
//             }}>
//             {text}
//           </p>
//         )
//       })}
//     </div>
//   }
// }

// export default Danmu
