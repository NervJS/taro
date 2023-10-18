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
#[cfg(test)]
mod tests;

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
