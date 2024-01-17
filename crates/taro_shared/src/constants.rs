use handlebars::{handlebars_helper, Handlebars, JsonRender};
use handlebars_misc_helpers::{new_hbs, register};
use napi_derive::napi;
use once_cell::sync::Lazy;
use serde::Serialize;
use serde_json::Value;

handlebars_helper!(includes: |{ s: str = "" }, *args| args.iter().map(|a| a.render()).any(|arg| arg == s));
handlebars_helper!(default_if_none: |value: Option<String>, default: String| value.unwrap_or(default));
handlebars_helper!(convert_to_kb: |value: f32| format!("{:.2}", value / 1024_f32));
handlebars_helper!(json: |value: Value| serde_json::to_string(&value).unwrap_or("".to_string()));
handlebars_helper!(len_gt: |value: Vec<Value>, len: usize| value.len() > len);

pub static HANDLEBARS: Lazy<Handlebars<'static>> = Lazy::new(|| {
  let mut hbs = new_hbs();
  register(&mut hbs);
  hbs.register_helper("includes", Box::new(includes));
  hbs.register_helper("defaultIfNone", Box::new(default_if_none));
  hbs.register_helper("convertToKb", Box::new(convert_to_kb));
  hbs.register_helper("json", Box::new(json));
  hbs.register_helper("lenGt", Box::new(len_gt));
  hbs
});

#[derive(Debug, PartialEq, Eq, Hash, Serialize)]
#[napi(string_enum)]
pub enum CSSType {
  None,
  Sass,
  Stylus,
  Less,
}

#[derive(Debug, PartialEq, Eq, Hash, Serialize)]
#[napi(string_enum)]
pub enum FrameworkType {
  React,
  Preact,
  Vue,
  Vue3,
}

#[derive(Debug, PartialEq, Eq, Hash, Serialize)]
#[napi(string_enum)]
pub enum NpmType {
  Yarn,
  Cnpm,
  Pnpm,
  Npm,
}

#[derive(Debug, PartialEq, Eq, Hash, Serialize)]
#[napi(string_enum)]
pub enum CompilerType {
  Webpack4,
  Webpack5,
  Vite,
}

#[derive(Debug, PartialEq, Eq, Hash, Serialize)]
#[napi(string_enum)]
pub enum PeriodType {
  CreateAPP,
  CreatePage,
}

#[derive(Debug)]
#[napi(object)]
pub struct FileType {
  pub templ: String,
  pub style: String,
  pub script: String,
  pub config: String,
  pub xs: Option<String>,
}
