use swc_core::ecma::{
    parser,
    visit::{as_folder, Fold},
};
use crate::{
    PluginConfig,
    transform::*,
};

fn tr () -> impl Fold {
    let config = serde_json::from_str::<PluginConfig>(
        r#"
        {
            "tmpl_prefix": "f0",
            "platform": "ALIPAY",
            "components": {
                "view": {
                    "hover-class": "xs.b(i.p3,'none')",
                    "hover-stop-propagation": "xs.b(i.p6,!1)",
                    "hover-start-time": "xs.b(i.p4,50)",
                    "hover-stay-time": "xs.b(i.p5,400)",
                    "onTouchStart": "eh",
                    "onTouchMove": "eh",
                    "onTouchEnd": "eh",
                    "onTouchCancel": "eh",
                    "onLongTap": "eh",
                    "animation": "i.p0",
                    "onAnimationStart": "eh",
                    "onAnimationIteration": "eh",
                    "onAnimationEnd": "eh",
                    "onTransitionEnd": "eh",
                    "disable-scroll": "xs.b(i.p1,false)",
                    "hidden": "xs.b(i.p2,false)",
                    "onAppear": "eh",
                    "onDisappear": "eh",
                    "onFirstAppear": "eh",
                    "style": "i.st",
                    "class": "i.cl",
                    "onTap": "eh"
                }
            },
            "adapter": {
                "if": "a:if",
                "else": "a:else",
                "elseif": "a:elif",
                "for": "a:for",
                "forItem": "a:for-item",
                "forIndex": "a:for-index",
                "key": "a:key",
                "xs": "sjs",
                "type": "alipay"
            }
        }"#
    )
    .unwrap();
    let visitor = TransformVisitor::new(config);
    as_folder(visitor)
}

test!(
    get_syntax_config(),
    |_| tr(),
    should_event_name_in_camelcase,
    r#"
    function Index () {
        return (
          <View compileMode>
            <View onClick={cb} onAnimationStart={cb}></View>
          </View>
        )
      }
    "#
);
