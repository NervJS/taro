import _extends from '@babel/runtime/helpers/extends';
import React from 'react';
import View from '@tarojs/components-rn/dist/components/View';
import Text from '@tarojs/components-rn/dist/components/Text';
import { Dimensions, StyleSheet } from 'react-native';

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 375;

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

var indexScssStyleSheet = StyleSheet.create({
  "cellGroup": {
    "backgroundColor": "white",
    "borderRadius": scalePx2dp(10)
  },
  "cellItem": {
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "paddingLeft": scalePx2dp(15),
    "paddingRight": scalePx2dp(15),
    "height": scalePx2dp(49)
  },
  "cellItem--care": {
    "height": scalePx2dp(64)
  },
  "cellItem__title": {
    "color": "#333",
    "fontWeight": "bold"
  },
  "cellItem__line": {
    "height": scalePx2dp(0.5),
    "backgroundColor": "#f4f4f4"
  }
});

function _mergeEleStyles(){return [].concat.apply([],arguments).reduce((pre,cur)=>Object.assign(pre,cur),{});}var _styleSheet=indexScssStyleSheet;function Cell(_ref){var children=_ref.children,style=_ref.style;var childs=Array.isArray(children)?children:[children];return React.createElement(View,{style:_mergeEleStyles(_styleSheet["cellGroup"],_extends({},style))},childs.map(function(it,i){return [it].concat(i===children.length-1?[]:React.createElement(View,{key:"line-"+i,style:_styleSheet["cellItem__line"]}));}));}function Item(_ref2){var title=_ref2.title,children=_ref2.children,style=_ref2.style;return React.createElement(View,{style:_mergeEleStyles(_styleSheet["cellItem"],_extends({},style))},React.createElement(Text,{style:_styleSheet["cellItem__title"]},title),React.createElement(View,{style:_styleSheet["cellItem__content"]},children));}Cell.Item=Item;

export { Cell as default };
