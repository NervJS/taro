pub use super::get_syntax_config;
use swc_core::ecma::visit::{as_folder, Fold, VisitMut};
use crate::{
  PluginConfig,
  harmony_transform::*,
};

mod entry;
mod attributes;
mod condition;
mod looping;

pub fn tr () -> impl Fold + VisitMut {
  let config = serde_json::from_str::<PluginConfig>(
      r#"
      {
          "is_harmony": true,
          "tmpl_prefix": "f0",
          "components": {
              "block": {},
              "image": {
                  "onLoad": "onComplete"
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
          }
      }"#
  )
  .unwrap();
  let visitor = TransformVisitor::new(config);
  as_folder(visitor)
}
