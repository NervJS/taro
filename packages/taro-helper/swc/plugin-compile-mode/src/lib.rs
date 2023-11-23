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
mod transform_harmony;
use transform_harmony as harmony_transform;
#[cfg(test)]
mod tests;


#[derive(Serialize, Deserialize, Debug)]
pub struct PluginConfig {
    pub is_harmony: Option<bool>,
    pub tmpl_prefix: String,
    pub components: Option<HashMap<String, HashMap<String, String>>>,
    pub adapter: Option<HashMap<String, String>>,
    pub support_events: Option<Vec<String>>,
    pub support_components: Option<Vec<String>>,
    pub event_adapter: Option<HashMap<String, String>>,
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
    let config: PluginConfig = serde_json::from_str::<PluginConfig>(
        &metadata
            .get_transform_plugin_config()
            .unwrap()
    )
    .unwrap();

    // 如果 config 中的 is_harmony 字段为 true 则走 harmony_transform, 否则则走 transform
    match config.is_harmony {
        Some(true) => {
            let visitor = harmony_transform::TransformVisitor::new(config);
            program.fold_with(&mut as_folder(visitor))
        },
        _ => {
            let visitor = transform::TransformVisitor::new(config);
            program.fold_with(&mut as_folder(visitor))
        }
    }
}
