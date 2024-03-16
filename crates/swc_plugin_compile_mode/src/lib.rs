use swc_core::{
    ecma::{
        ast::Program,
        visit::{as_folder, FoldWith, VisitMut},
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};
use serde::{Deserialize};
use std::collections::HashMap;

mod utils;
mod transform;
mod transform_harmony;
#[cfg(test)]
mod tests;

struct SerdeDefault;
impl SerdeDefault {
    fn platform_default () -> String {
        String::from("WEAPP")
    }
}

#[derive(Deserialize, Debug)]
pub struct PluginConfig {
    pub tmpl_prefix: String,
    #[serde(default = "SerdeDefault::platform_default")]
    pub platform: String,
    #[serde(default)]
    pub is_harmony: bool,
    #[serde(default)]
    pub components: HashMap<String, HashMap<String, String>>,
    #[serde(default)]
    pub adapter: HashMap<String, String>,
    #[serde(default)]
    pub support_events: Vec<String>,
    #[serde(default)]
    pub support_components: Vec<String>,
    #[serde(default)]
    pub event_adapter: HashMap<String, String>,
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

    // 如果 config 中的 is_harmony 字段为 true 则走 harmony_transform, 否则则走 transform
    let visitor: Box<dyn VisitMut> = if config.is_harmony {
        Box::new(transform_harmony::TransformVisitor::new(config))
    } else {
        Box::new(transform::TransformVisitor::new(config))
    };

    program.fold_with(&mut as_folder(visitor))
}
