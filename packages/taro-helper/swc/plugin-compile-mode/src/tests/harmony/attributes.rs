use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};
use crate::utils::constants::*;

test!(
    get_syntax_config(),
    |_| tr(),
    should_turn_dynamic_attrs,
    r#"
    function Index () {
        return (
          <View compileMode>
            <View class={myClass}>
              <View style={myStyle} customProp={myCustomProp}></View>
              <View hoverStayTime={myTime}>
                <View hoverClass={myHoverClass}></View>
              </View>
            </View>
          </View>
        )
      }
    "#,
    &(
    format!("const TARO_TEMPLATES_f0t0 = `import {{ FlexManager }} from './utils/FlexManager'
    import {{ getNodeThresholds, getNormalAttributes, getFontAttributes{} }} from './utils/helper'
    import {{ eventHandler, DynamicCenter, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME{} }} from '../runtime'
    import type {{ {} }} from '../runtime'
    {}
    ", ", transformW3CToHarmonyInStyle", "", "TaroViewElement", "")
    +
    HARMONY_FLEX_STYLE_BIND
    +
    r#"
    @Component
struct TARO_TEMPLATES_f0t0 {
  nodeInfoMap: any = {}
  dynamicCenter: DynamicCenter
  @ObjectLink node: TaroViewElement
  @State node1: TaroViewElement = new TaroIgnoreElement()
  @State node2: TaroViewElement = new TaroIgnoreElement()
  @State node3: TaroViewElement = new TaroIgnoreElement()
  @State node4: TaroViewElement = new TaroIgnoreElement()
  @State node5: TaroViewElement = new TaroIgnoreElement()

  aboutToAppear () {
    this.dynamicCenter = new DynamicCenter()
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  build() {
    Flex(FlexManager.flexOptions(this.node1)) {
      Flex(FlexManager.flexOptions(this.node2)) {
        Flex(FlexManager.flexOptions(this.node3)) {}
        .attrs(getNormalAttributes(this.node3))
        .onVisibleAreaChange(getNodeThresholds(this.node3) || [0.0, 1.0], getComponentEventCallback(this.node3, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node3, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node3._nid].areaInfo = areaResult
        }))
        Flex(FlexManager.flexOptions(this.node4)) {
          Flex(FlexManager.flexOptions(this.node5)) {}
          .attrs(getNormalAttributes(this.node5))
          .onVisibleAreaChange(getNodeThresholds(this.node5) || [0.0, 1.0], getComponentEventCallback(this.node5, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node5, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
            const [_, areaResult] = eventResult
            this.nodeInfoMap[this.node5._nid].areaInfo = areaResult
          }))
        }
        .attrs(getNormalAttributes(this.node4))
        .onVisibleAreaChange(getNodeThresholds(this.node4) || [0.0, 1.0], getComponentEventCallback(this.node4, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node4, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
          const [_, areaResult] = eventResult
          this.nodeInfoMap[this.node4._nid].areaInfo = areaResult
        }))
      }
      .attrs(getNormalAttributes(this.node2))
      .onVisibleAreaChange(getNodeThresholds(this.node2) || [0.0, 1.0], getComponentEventCallback(this.node2, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
        const [_, areaResult] = eventResult
        this.nodeInfoMap[this.node2._nid].areaInfo = areaResult
      }))
    }
    .attrs(getNormalAttributes(this.node1))
    .onVisibleAreaChange(getNodeThresholds(this.node1) || [0.0, 1.0], getComponentEventCallback(this.node1, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node1, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      this.nodeInfoMap[this.node1._nid].areaInfo = areaResult
    }))
  }
}

export default TARO_TEMPLATES_f0t0
    `
    function Index () {
      return (
        <View compileMode="f0t0" _dynamicID='node1'>
          <View class={myClass} _dynamicID='node2'>
            <View style={myStyle} customProp={myCustomProp} _dynamicID='node3'></View>
            <View hoverStayTime={myTime} _dynamicID='node4'>
              <View hoverClass={myHoverClass} _dynamicID='node5'></View>
            </View>
          </View>
        </View>
      )
    }
    "#)
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_handle_events,
    r#"
    function Index () {
        return (
          <View compileMode>
            <View onClick={handleViewClick}></View>
            <View onAnimationStart={() => {}} id={myId}></View>
            <Image onLoad={() => {}} id="myImg" />
          </View>
        )
      }
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view bindtap="eh" data-sid="{{i.cn[0].sid}}" id="{{i.cn[0].sid}}"></view><view bindanimationstart="eh" data-sid="{{i.cn[1].sid}}" id="{{i.cn[1].id}}"></view><image bindload="eh" data-sid="{{i.cn[2].sid}}" id="myImg"></image></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            <View onClick={handleViewClick}></View>
            <View onAnimationStart={() => {}} id={myId}></View>
            <Image onLoad={() => {}} />
          </View>
    }
    "#
);
