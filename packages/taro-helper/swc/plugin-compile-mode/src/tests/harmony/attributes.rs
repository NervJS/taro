use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_keep_static_attrs_only_in_templates,
    r#"
    function Index () {
        return (
          <View compileMode>
            <Image className="my_img" src="https://taro.com/x.png" lazyLoad />
          </View>
        )
    }
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><image class="my_img" lazy-load="true" src="https://taro.com/x.png"></image></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            
          </View>
    }
    "#
);

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
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view class="{{i.cn[0].cl}}"><view custom-prop="{{i.cn[0].cn[0].customProp}}" style="{{i.cn[0].cn[0].st}}"></view><view hover-stay-time="{{xs.b(i.cn[0].cn[1].p3,400)}}"><view hover-class="{{xs.b(i.cn[0].cn[1].cn[0].p1,\'none\')}}"></view></view></view></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            <View class={myClass}>
              <View style={myStyle} customProp={myCustomProp}></View>
              <View hoverStayTime={myTime}>
                <View hoverClass={myHoverClass}></View>
              </View>
            </View>
          </View>
    }
    "#
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
