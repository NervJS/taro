import React, { Component } from 'react'
import { Video } from '../../dist'

export default class EXSlider extends Component {
  state = {
    progressPercent: 70
  }

  render () {
    return (
      <Video
        src='http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
        autoplay={false}
        controls={true}
        showProgress={true}
        showFullscreenBtn={true}
        showPlayBtn={true}
        showCenterPlayBtn={false}
      />
    )
  }
}
