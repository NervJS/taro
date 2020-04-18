/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')
class Footer extends React.Component {
  render () {
    return (
      <footer className='footer' id='footer'>
        <div className='grid_c1 footer_cont'>
          <div className='footer_logo_container'>
            <div className='footer_logo' />
            <span className='footer_designedby' />
          </div>
          <div className='footer_link_container'>
            <div className='footer_link'>
              <h3 className='footer_link_tit footer_link_tit1'>相关资源</h3>
              <p><a className='link' href='https://taro.jd.com/' target='_blank'>Taro</a></p>
              <p><a className='link' href='https://taro-ui.jd.com/' target='_blank'>Taro UI</a></p>
              <p><a className='link' href='https://at-ui.github.io/at-ui/#/zh' target='_blank'>At-UI</a></p>
              <p><a className='link' href='https://nerv.aotu.io/' target='_blank'>Nerv</a></p>
              <p><a className='link' href='https://athena.aotu.io/' target='_blank'>Athena</a></p>
            </div>
            <div className='footer_link'>
              <h3 className='footer_link_tit footer_link_tit2'>社区</h3>
              <p><a href='https://github.com/NervJS/taro/issues' target='_blank'>GitHub</a></p>
              <p><a href='https://taro-club.jd.com' target='_blank'>Taro BBS</a></p>
              <p className='footer_link_connect_wrap'>
                <span className='footer_link_connect footer_link_wechat'>微信<span className='wechat_qrcode_icon'>
                  <svg t='1554966525626' className='icon svgicon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2588' data-spm-anchor-id='a313x.7781069.0.i0'>
                    <path d='M240.071 241.095h59.278v59.278h-59.278v-59.278z' fill='' p-id='2589' />
                    <path d='M405.959 134.485h-272.611v272.611h106.723v47.445h59.278v-47.445h106.723v-59.278h47.445v-47.445h-47.445l-0.114-165.888zM346.795 347.819h-154.169v-154.055h154.055v154.055h0.114zM240.071 727.154h59.278v59.278h-59.278v-59.278zM726.016 241.095h59.278v59.278h-59.278v-59.278zM512.683 509.042v63.943h59.278v-59.165h47.445v-59.278h-47.445v-47.445h-59.278v101.945zM512.683 725.789v60.643h59.278v-106.723h47.445v-59.278h-106.723v105.358zM571.961 786.432h47.445v47.445h-47.445v-47.445zM453.405 833.877v59.165h118.557v-59.165h-118.557z' fill='' p-id='2590' />
                    <path d='M678.685 679.709h-59.278v106.723h106.61v-59.278h-47.331v-47.445zM726.016 893.042h166.002v-59.165h-106.723v-47.445h-59.278v106.61zM892.018 513.821v-59.278h-106.723v59.278h106.723zM832.739 727.154h59.278v59.278h-59.278v-59.278zM453.405 347.819h59.278v59.278h-59.278v-59.278zM726.016 454.542v-47.445h166.002v-272.611h-272.611v59.278h-106.723v47.445h106.723v59.165h-47.445v47.445h47.445v59.278h59.278v47.445h47.331zM678.685 193.763h154.055v154.055h-154.055v-154.055zM678.685 572.985h47.331v47.445h-47.331v-47.445zM785.294 679.709h-59.278v47.445h106.723v-106.723h59.278v-47.445h-106.723v106.723zM453.405 241.095h59.278v59.278h-59.278v-59.278zM299.349 513.821h47.445v59.165h-47.445v-59.165zM453.405 454.542h-106.61v59.278h59.165v59.165h47.445v-118.443z' fill='' p-id='2591' />
                    <path d='M405.959 786.432v-106.723h47.445v-59.278h-213.333v-106.61h-106.723v59.278h59.278v47.445h-59.278v272.611h272.611v-59.278h47.445v-47.445h-47.445zM346.795 833.877h-154.169v-154.169h154.055v154.169h0.114zM453.405 572.985h59.278v47.445h-59.278v-47.445zM619.406 513.821h59.278v59.165h-59.278v-59.165zM726.016 513.821h59.278v59.165h-59.278v-59.165z' fill='' p-id='2592' />
                  </svg>
                </span></span>
                <span className='footer_link_wechat_img'>
                  <img src='https://img11.360buyimg.com/ling/jfs/t1/105094/21/15729/35411/5e74e903Ed1490359/5991e49a33964c93.png' />
                </span>
              </p>
            </div>
            <div className='footer_link'>
              <h3 className='footer_link_tit footer_link_tit3'>关于我们</h3>
              <p><a href='https://aotu.io/' target='_blank'>凹凸实验室</a></p>
              <p><a href='https://aotu.io/join/' target='_blank'>加入我们</a></p>
              <p><a href='mailto:taro@jd.com?subject=【Taro 合作】合作标题'>联系我们</a></p>
            </div>
            <div className='footer_link'>
              <h3 className='footer_link_tit footer_link_tit4'>感谢</h3>
              <p><a href='http://jdc.jd.com/' target='_blank'>用户体验设计部</a></p>
              <p><a href='https://github.com/nervjs/taro#%E8%B4%A1%E7%8C%AE%E8%80%85%E4%BB%AC' target='_blank'>Taro 贡献者们</a></p>
            </div>
          </div>
        </div>
        <div className='copyright'>
          <div className='in'>Copyright © 2019. All Rights Reserved. 粤ICP备15077732号-2</div>
        </div>
      </footer>
    )
  }
}

module.exports = Footer
