use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

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
              <View class="center" />
              <View onTouch={myTime}>
                <View hoverClass={myHoverClass}></View>
              </View>
            </View>
            <Image alt="占位符" src="https://www.jd.com/test.jpg" />
            <Image alt="占位符" src={src} />
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
            <View onClick={() => { console.log("click done") }}></View>
            <View onClick={function clickFn () { console.log("click done") }}></View>
            <View onClick={handleViewClick}></View>
            <View onAnimationStart={() => {}} id={myId}></View>
            <Image onLoad={() => { console.log("load done") }} id="myImg" />
            <View onClick={() => { console.log("click done") }} onTouchStart={() => { console.log("touch start done") }} />
          </View>
        )
      }
    "#
);
