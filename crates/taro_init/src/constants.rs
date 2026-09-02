use std::collections::HashMap;

use handlebars::{handlebars_helper, Handlebars, JsonRender};
use handlebars_misc_helpers::{new_hbs, register};
use napi_derive::napi;
use once_cell::sync::Lazy;
use serde::Serialize;

handlebars_helper!(includes: |{ s: str = "" }, *args| args.iter().map(|a| a.render()).any(|arg| arg == s));
// handlebars_helper!(eq: |x: str, y: str| x == y);

// 语义：运行时数组 `arr` 中是否包含 `vals` 中任意一个候选值（字符串比较）。
// 与 `includes` 相反：`includes` 是"候选值列表（模板里写死）中是否存在等于运行时变量的项"。
handlebars_helper!(array_includes: |arr: array, *vals| vals.iter().any(|v| arr.iter().any(|item| item.as_str() == v.as_str())));

pub static HANDLEBARS: Lazy<Handlebars<'static>> = Lazy::new(|| {
  let mut hbs = new_hbs();
  register(&mut hbs);
  hbs.register_helper("includes", Box::new(includes));
  hbs.register_helper("array_includes", Box::new(array_includes));
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
  map.insert(&FrameworkType::Vue3, "vue3");
  map.insert(&FrameworkType::Solid, "solid");
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
  Lazy::new(|| regex::Regex::new(r"\.(png|jpe?g|gif|svg|webp|jar|keystore|tgz)$").unwrap());

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
  Vue3,
  Solid,
  None,
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

#[cfg(test)]
mod tests {
  use serde_json::json;

  use super::HANDLEBARS;

  fn render(tpl: &str, platforms: &[&str]) -> String {
    HANDLEBARS
      .render_template(tpl, &json!({ "platforms": platforms }))
      .unwrap()
  }

  #[test]
  fn test_array_includes_single_value() {
    assert_eq!(
      render("{{#if (array_includes platforms \"weapp\")}}yes{{else}}no{{/if}}", &["weapp", "h5"]),
      "yes"
    );
    assert_eq!(
      render("{{#if (array_includes platforms \"weapp\")}}yes{{else}}no{{/if}}", &["h5"]),
      "no"
    );
  }

  #[test]
  fn test_array_includes_multiple_values() {
    let tpl = "{{#if (array_includes platforms \"weapp\" \"alipay\" \"swan\" \"tt\" \"qq\" \"jd\")}}yes{{else}}no{{/if}}";
    assert_eq!(render(tpl, &["h5"]), "no");
    assert_eq!(render(tpl, &["h5", "swan"]), "yes");
    assert_eq!(render(tpl, &[]), "no");
  }
}
