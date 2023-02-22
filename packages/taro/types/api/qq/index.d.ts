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

import Taro from '../../index'

declare module '../../index' {
  namespace openQzonePublish {
    interface Option {
      /** 传递的文字内容 */
      text: string
      /** 传递的视频/图片内容，显示顺序为元素下标顺序 */
      media: Media[]
      /** 说说小尾巴跳转到的页面路径，不填则默认跳到主页 */
      path: string
      /** 说说小尾巴显示的文案，不填则默认显示小程序的简介文案 */
      footnote: string
    }
    type Media = {
      /** 图片填"photo"，视频填"video" */
      type: MediaType
      /** 文件路径，必须为本地文件 */
      path: string
    }
    type MediaType = 'photo' | 'video'
  }

  interface TaroStatic {
    /**
     * 此接口可打开手Q说说发表界面，并将文字内容和图片/视频内容传递到手Q说说发表界面。
     * ```tsx
     * Taro.openQzonePublish({
     *   footnote: '使用同款滤镜',
     *   path: 'pages/index/index',
     *   text: '我爱中国',
     *   media: [
     *     {
     *       type: 'photo',
     *       path: 'qqfile://1.png'
     *     },
     *     {
     *       type: 'video',
     *       path: 'qqfile://2.mp4'
     *     }
     *   ]
     * })
     * ```
     * @supported qq
     * @see https://q.qq.com/wiki/develop/miniprogram/API/open_port/port_openQzonePublish.html
     */
    openQzonePublish(option: openQzonePublish.Option): void
  }
}
