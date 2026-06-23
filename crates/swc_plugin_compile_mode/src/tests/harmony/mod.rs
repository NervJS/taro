pub use super::get_syntax_config;
use crate::{transform_harmony::*, PluginConfig};
use swc_core::ecma::visit::{as_folder, Fold, VisitMut};

mod attributes;
mod children;
mod condition;
mod entry;
mod looping;

pub fn tr() -> impl Fold + VisitMut {
  let config = serde_json::from_str::<PluginConfig>(
    r#"
      {
          "is_harmony": true,
          "tmpl_prefix": "f0",
          "support_events": [
            "onLoad",
            "onClick",
            "onTouchEnd",
            "onTouchMove",
            "onTouchStart",
            "onTouchCancel"
          ],
          "support_components": [
            "view",
            "text",
            "image"
          ],
          "event_adapter": {
            "onTouchEnd": "onTouch",
            "onTouchMove": "onTouch",
            "onTouchStart": "onTouch",
            "onTouchCancel": "onTouch",
            "onLoad": "onComplete"
          }
      }"#,
  )
  .unwrap();
  let visitor = TransformVisitor::new(config);
  as_folder(visitor)
}
