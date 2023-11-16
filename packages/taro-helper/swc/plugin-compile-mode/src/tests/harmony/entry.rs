use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};
use crate::utils::constants::*;

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_single_compile_mode,
  "
  function Index () {
    return (
      <View compileMode></View>
    )
  }
  ",
  &(
"const TARO_TEMPLATES_f0t0 = `".to_owned() + HARMONY_IMPORTER + HARMONY_FLEX_STYLE_BIND + r#"
@Component
struct TARO_TEMPLATES_f0t0 {
  nodeInfoMap: any = {}
  dynamicCenter: DynamicCenter
  @ObjectLink node: TaroElement
  
  aboutToAppear () {
    this.dynamicCenter = new DynamicCenter()
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroIgnoreElement()

  build() {
    Flex(FlexManager.flexOptions(this.node0)) {}
    .attrs(getNormalAttributes(this.node0))
    .onVisibleAreaChange(getNodeThresholds(this.node0) || [0.0, 1.0], getComponentEventCallback(this.node0, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      this.nodeInfoMap[this.node0._nid].areaInfo = areaResult
    }))
  }
}
export default TARO_TEMPLATES_f0t0
`
  function Index () {
    return <View compileMode="f0t0" _dynamicID="node0"></View>
  }
  "#)
);

// test!(
//     get_syntax_config(),
//     |_| tr(),
//     should_support_multi_compile_mode,
//     r#"
//     function Index () {
//         return (
//           <View>
//             <Image src={mySrc} compileMode />
//             <View compileMode>
//               <Text>{myText}</Text>
//             </View>
//           </View>
//         )
//       }
//     "#,
//     r#"
//     const TARO_TEMPLATES_f0t0 = `<template name="tmpl_0_f0t0"><image src="{{i.p3}}"></image></template>`;
//     const TARO_TEMPLATES_f0t1 = '<template name="tmpl_0_f0t1"><view><text>{{i.cn[0].cn[0].v}}</text></view></template>';
//     function Index () {
//         return <View>
//             <Image src={mySrc} compileMode="f0t0" />
//             <View compileMode="f0t1">
//               <Text>{myText}</Text>
//             </View>
//           </View>
//     }
//     "#
// );