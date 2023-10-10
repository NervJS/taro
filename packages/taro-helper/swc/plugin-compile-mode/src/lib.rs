use swc_core::{
    ecma::{
        ast::Program,
        visit::{as_folder, FoldWith},
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use core::fmt::Debug;

mod utils;
mod transform;

#[derive(Serialize, Deserialize, Debug)]
pub struct PluginConfig {
    pub tmpl_prefix: String,
    pub components: HashMap<String, HashMap<String, String>>,
    pub adapter: HashMap<String, String>,
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str::<PluginConfig>(
        &metadata
            .get_transform_plugin_config()
            .unwrap()
    )
    .unwrap();
    let visitor = transform::TransformVisitor::new(config);
    program.fold_with(&mut as_folder(visitor))
}


// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
#[cfg(test)]
mod tests{
    use swc_core::ecma::{
        transforms::testing::test,
        parser,
        visit::{as_folder, Fold, VisitMut},
    };
    use super::{
        PluginConfig,
        transform::*,
    };

    fn tr () -> impl Fold + VisitMut {
        let config = serde_json::from_str::<PluginConfig>(
            r#"
            {
                "tmpl_prefix": "f0",
                "components": {
                    "image": {
                        "src": "i.p3",
                        "mode": "xs.b(i.p1,'scaleToFill')",
                        "lazy-load": "xs.b(i.p0,!1)",
                        "binderror": "eh",
                        "bindload": "eh",
                        "bindtouchstart": "eh",
                        "bindtouchmove": "eh",
                        "bindtouchend": "eh",
                        "bindtouchcancel": "eh",
                        "bindlongpress": "eh",
                        "webp": "xs.b(i.p4,false)",
                        "show-menu-by-longpress": "xs.b(i.p2,false)",
                        "style": "i.st",
                        "class": "i.cl",
                        "bindtap": "eh"
                    },
                    "view": {
                        "hover-class": "xs.b(i.p1,'none')",
                        "hover-stop-propagation": "xs.b(i.p4,!1)",
                        "hover-start-time": "xs.b(i.p2,50)",
                        "hover-stay-time": "xs.b(i.p3,400)",
                        "bindtouchstart": "eh",
                        "bindtouchmove": "eh",
                        "bindtouchend": "eh",
                        "bindtouchcancel": "eh",
                        "bindlongpress": "eh",
                        "animation": "i.p0",
                        "bindanimationstart": "eh",
                        "bindanimationiteration": "eh",
                        "bindanimationend": "eh",
                        "bindtransitionend": "eh",
                        "style": "i.st",
                        "class": "i.cl",
                        "bindtap": "eh"
                    },
                    "text": {
                        "selectable": "xs.b(i.p1,!1)",
                        "space": "i.p2",
                        "decode": "xs.b(i.p0,!1)",
                        "user-select": "xs.b(i.p3,false)",
                        "style": "i.st",
                        "class": "i.cl",
                        "bindtap": "eh"
                    },
                    "movable-area": {
                        "scale-area": "xs.b(i.p0,!1)",
                        "style": "i.st",
                        "class": "i.cl",
                        "bindtap": "eh"
                    }
                },
                "adapter": {
                    "if": "wx:if",
                    "else": "wx:else",
                    "elseif": "wx:elif",
                    "for": "wx:for",
                    "forItem": "wx:for-item",
                    "forIndex": "wx:for-index",
                    "key": "wx:key",
                    "xs": "wxs",
                    "type": "weapp"
                }
            }"#
        )
        .unwrap();
        let visitor = TransformVisitor::new(config);
        as_folder(visitor)
    }

    test!(
        parser::Syntax::Es(parser::EsConfig {
            jsx: true,
            ..Default::default()
        }),
        |_| tr(),
        boo,
        // Input codes
        r#"
        function Index () {
            return (
              <View>
                <View className='sku-feeds__item' compileMode>
                  <Image
                    mode='aspectFit'
                    src={getImg(pictureUrl, -1)}
                    className='sku-feeds__img'
                  />
                  <View className='sku-feeds__info'>
                    <View className='sku-feeds__name'>{name}</View>
                    <View className='sku-feeds__info-footer'>
                      <View className='sku-feeds__price-info'>
                        <View className='sku-feeds__price'>
                          <Text className='sku-feeds__unit'>¥</Text>
                          <Text className='sku-feeds__num'>{pPrice}</Text>
                        </View>
                        {hasDiscount && (
                          <View className='sku-feeds__line-price'>
                            <Text className='sku-feeds__unit'>¥</Text>
                            <Text className='sku-feeds__num'>{linePrice}</Text>
                          </View>
                        )}
                      </View>
                      <View className={'sku-feeds__btn' + (this.state.active ? ' sku-feeds__btn--active' : '')} onClick={() => {
                        this.setState({
                          active: true
                        })
                        setTimeout(() => {
                          this.setState({
                            active: false
                          })
                        }, 1000)
                      }}></View>
                    </View>
                  </View>
                </View>
              </View>
            )
          }
        "#,
        // Output codes after transformed with plugin
        r#"
        function Index () {
            return <View>
                <View compileMode="f0t0">
                  <Image src={getImg(pictureUrl, -1)} />
                  <View>
                    <View>{name}</View>
                    <View>
                      <View>
                        <View>
                          <Text>¥</Text>
                          <Text>{pPrice}</Text>
                        </View>
                        {<View compileIf={hasDiscount}>
                            <Text>¥</Text>
                            <Text>{linePrice}</Text>
                          </View>}
                      </View>
                      <View className={'sku-feeds__btn' + (this.state.active ? ' sku-feeds__btn--active' : '')} onClick={() => {
                        this.setState({
                          active: true
                        })
                        setTimeout(() => {
                          this.setState({
                            active: false
                          })
                        }, 1000)
                      }}></View>
                    </View>
                  </View>
                </View>
              </View>
        }
        "#
    );

    // Todo 补测试用例，整理测试目录结构
    test!(
        parser::Syntax::Es(parser::EsConfig {
            jsx: true,
            ..Default::default()
        }),
        |_| tr(),
        should_support_multi_compile_mode,
        r#"
        function Index () {
            return (
              <View>
                <Image src={mySrc} compileMode />
                <View compileMode>
                  <Text>Hello World!</Text>
                </View>
              </View>
            )
          }
        "#,
        r#"
        const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><image src="{{i.p3}}"></image></template>';
        const TARO_TEMPLATES_f0t1 = '<template name="tmpl_0_f0t1"><view><text>Hello World!</text></view></template>';
        function Index () {
            return <View>
                <Image src={mySrc} compileMode="f0t0" />
                <View compileMode="f0t1">
                  <Text>Hello World!</Text>
                </View>
              </View>
        }
        "#
    );

    test!(
        parser::Syntax::Es(parser::EsConfig {
            jsx: true,
            ..Default::default()
        }),
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
                <Image />
              </View>
        }
        "#
    );

    test!(
        parser::Syntax::Es(parser::EsConfig {
            jsx: true,
            ..Default::default()
        }),
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
        parser::Syntax::Es(parser::EsConfig {
            jsx: true,
            ..Default::default()
        }),
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
}
