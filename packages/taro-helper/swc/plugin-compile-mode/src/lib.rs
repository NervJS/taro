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
    pub component_alias: HashMap<String, HashMap<String, String>>
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
                "component_alias": {
                    "image": {
                        "_num": "1",
                        "lazyLoad": "p0",
                        "mode": "p1",
                        "showMenuByLongpress": "p2",
                        "src": "p3",
                        "webp": "p4"
                    },
                    "text": { "_num": "6", "decode": "p0", "selectable": "p1", "space": "p2" },
                    "view": {
                        "_num": "7",
                        "animation": "p0",
                        "hoverClass": "p1",
                        "hoverStartTime": "p2",
                        "hoverStayTime": "p3",
                        "hoverStopPropagation": "p4"
                    }
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
}