use std::collections::HashMap;

use napi_derive::napi;
use once_cell::sync::Lazy;
use serde::Serialize;
use handlebars::{handlebars_helper, Handlebars, JsonRender};
use handlebars_misc_helpers::{new_hbs, register};

handlebars_helper!(includes: |{ s: str = "" }, *args| args.iter().map(|a| a.render()).any(|arg| arg == s));
// handlebars_helper!(eq: |x: str, y: str| x == y);

pub static HANDLEBARS: Lazy<Handlebars<'static>> = Lazy::new(|| {
  let mut hbs = new_hbs();
  register(&mut hbs);
  hbs.register_helper("includes", Box::new(includes));
  hbs
});

pub static STYLE_EXT_MAP: Lazy<HashMap<&CSSType, &str>> = Lazy::new(|| {
  let mut map = HashMap::new();
  map.insert(&CSSType::Sass, "scss");
  map.insert(&CSSType::Stylus, "styl");
  map.insert(&CSSType::Less, "less");
  map.insert(&CSSType::None, "css");
  map
});

pub static FRAMEWORK_TYPE_MAP: Lazy<HashMap<&FrameworkType, &str>> = Lazy::new(|| {
  let mut map = HashMap::new();
  map.insert(&FrameworkType::Preact, "preact");
  map.insert(&FrameworkType::React, "react");
  map.insert(&FrameworkType::Vue, "vue");
  map.insert(&FrameworkType::Vue3, "vue3");
  map
});

pub static PACKAGES_MANAGEMENT: Lazy<HashMap<&NpmType, PackageCommand>> = Lazy::new(|| {
  let mut map = HashMap::new();
  map.insert(
    &NpmType::Yarn,
    PackageCommand {
      command: "yarn",
      global_command: "yarn global add @tarojs/cli",
    },
  );
  map.insert(
    &NpmType::Cnpm,
    PackageCommand {
      command: "cnpm",
      global_command: "cnpm install -g @tarojs/cli",
    },
  );
  map.insert(
    &NpmType::Pnpm,
    PackageCommand {
      command: "pnpm",
      global_command: "pnpm install -g @tarojs/cli",
    },
  );
  map.insert(
    &NpmType::Npm,
    PackageCommand {
      command: "npm",
      global_command: "npm install -g @tarojs/cli",
    },
  );
  map
});

pub static MEDIA_REGEX: Lazy<regex::Regex> =
  Lazy::new(|| regex::Regex::new(r"\.(png|jpe?g|gif|svg|webp|jar|keystore)$").unwrap());

pub static TEMPLATE_CREATOR: &str = "template_creator.js";

pub static FILE_FILTER: Lazy<Vec<&str>> =
  Lazy::new(|| vec![TEMPLATE_CREATOR, ".DS_Store", ".npmrc"]);

#[derive(Debug)]
pub struct PackageCommand<'a> {
  pub command: &'a str,
  pub global_command: &'a str,
}

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
