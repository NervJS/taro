use crate::{visitors::entry::EntryVisitor, PluginConfig};
use swc_core::ecma::{
  parser,
  visit::{as_folder, Fold},
};

mod entry;
mod props;
mod render;

pub fn tr() -> impl Fold {
  let config = serde_json::from_str::<PluginConfig>(
    r#"
        {
          "sub_render_fn": "subRenderFn"
        }"#,
  )
  .unwrap();
  let visitor = EntryVisitor::new(config);
  as_folder(visitor)
}

pub fn get_syntax_config() -> parser::Syntax {
  parser::Syntax::Es(parser::EsConfig {
    jsx: true,
    ..Default::default()
  })
}
