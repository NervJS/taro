import React from 'react';
import { navigateBack } from '@tarojs/taro-rn/dist/api';
import View from '@tarojs/components-rn/dist/components/View';
import Text from '@tarojs/components-rn/dist/components/Text';
import Image from '@tarojs/components-rn/dist/components/Image';
import { Dimensions, StyleSheet } from 'react-native';

var iconBack = require('../../assets/icon_back-541a82be.webp');

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 375;

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

var indexScssStyleSheet = StyleSheet.create({
  "navbar": {
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
    "width": scalePx2dp(375),
    "height": scalePx2dp(50),
    "backgroundColor": "white"
  },
  "navbar-title-text": {
    "fontSize": scalePx2dp(19),
    "color": "#000"
  },
  "icon-back": {
    "width": scalePx2dp(19),
    "height": scalePx2dp(19)
  },
  "navbar-leftElement": {
    "width": scalePx2dp(50),
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "navbar-rightElement": {
    "width": scalePx2dp(50),
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  }
});

console.log('rn resolve');

var _styleSheet=indexScssStyleSheet;console.log('process.env.TARO_ENV',"rn");function Navbar(props){var title=props.title,rightElement=props.rightElement;return React.createElement(View,{style:_styleSheet["navbar"]},React.createElement(View,{style:_styleSheet["navbar-leftElement"]},React.createElement(Image,{src:iconBack,onClick:function back(){return navigateBack();},style:_styleSheet["icon-back"]})),React.createElement(View,{style:_styleSheet["navbar-title"]},typeof title==='string'?React.createElement(Text,{style:_styleSheet["navbar-title-text"]},title):title),React.createElement(View,{style:_styleSheet["navbar-rightElement"]},rightElement));}

export { Navbar as default };
