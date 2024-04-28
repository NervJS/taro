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
            <Image className="my_img" src="https://taro.com/x.png" lazyLoad key="image" ref={myRefCb} />
          </View>
        )
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
                <View hoverClass={myHoverClass} id={myId}></View>
              </View>
            </View>
          </View>
        )
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
    "#
);
