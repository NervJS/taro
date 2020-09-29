import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

export default class Index extends Component {
  render () {
    const html = `<div class="page" role="" aria-label=""></div>
    <div class="page__hd" role="" aria-label=""><span class="page__title"><span
          style="display:none;">image</span><span>image</span></span><span class="page__desc"><span
          style="display:none;">图片</span><span>图片</span></span></div>
    <div class="page__bd" role="" aria-label="">
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">scaleToFill：不保持纵横比缩放图片，使图片完全适应</div>
        <div class="section__ctn" role="" aria-label=""><img mode="scaleToFill"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: 100% 100%; background-position: 0% 0%; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来</div>
        <div class="section__ctn" role="" aria-label=""><img mode="aspectFit"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: contain; background-position: center center; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来</div>
        <div class="section__ctn" role="" aria-label=""><img mode="aspectFill"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: cover; background-position: center center; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">top：不缩放图片，只显示图片的顶部区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="top"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: center top; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">bottom：不缩放图片，只显示图片的底部区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="bottom"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: center bottom; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">center：不缩放图片，只显示图片的中间区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="center"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: center center; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">left：不缩放图片，只显示图片的左边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="left"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: left center; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">right：不缩放图片，只显示图片的右边边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="right"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: right center; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">top left：不缩放图片，只显示图片的左上边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="top left"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: left top; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">top right：不缩放图片，只显示图片的右上边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="top right"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: right top; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">bottom left：不缩放图片，只显示图片的左下边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="bottom left"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: left bottom; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
      <div class="section section_gap" role="" aria-label="">
        <div class="section__title" role="" aria-label="">bottom right：不缩放图片，只显示图片的右下边区域</div>
        <div class="section__ctn" role="" aria-label=""><img mode="bottom right"
            src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
            style="width: 200px; height: 200px; background-color: #eeeeee;">
          <div role="img" aria-label=""
            style='background-size: auto; background-position: right bottom; background-repeat: no-repeat; background-image: url("https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg");'>
          </div>
          <span></span></img>
        </div>
      </div>
    </div>
  </div>`
    return (
      <View className='index'>
        <View dangerouslySetInnerHTML={{ __html: html }}></View>
      </View>
    )
  }
}
