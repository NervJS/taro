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

mod transform;
mod tests;
struct SerdeDefault;
impl SerdeDefault {
    fn platform_default () -> String {
        String::from("WEAPP")
    }
}


#[derive(Deserialize, Debug)]
pub struct PluginConfig {
  #[serde(default = "SerdeDefault::platform_default")]
  pub platform: String,
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str::<PluginConfig>(
        &metadata
            .get_transform_plugin_config()
            .unwrap()
    )
    .unwrap();

    let visitor: Box<dyn VisitMut> = Box::new(transform::TransformVisitor::new(config));

    program.fold_with(&mut as_folder(visitor))
}
