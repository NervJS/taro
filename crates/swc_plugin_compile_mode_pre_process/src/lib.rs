use serde::Deserialize;
use swc_core::{
  ecma::{
    ast::Program,
    visit::{as_folder, FoldWith, VisitMut},
  },
  plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

#[cfg(test)]
mod tests;
mod utils;
mod visitors;
use visitors::entry::EntryVisitor;

#[derive(Deserialize, Debug)]
pub struct PluginConfig {
  #[serde(default)]
  sub_render_fn: String,
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
  let config =
    serde_json::from_str::<PluginConfig>(&metadata.get_transform_plugin_config().unwrap()).unwrap();

  let visitor: Box<dyn VisitMut> = Box::new(EntryVisitor::new(config));

  program.fold_with(&mut as_folder(visitor))
}
