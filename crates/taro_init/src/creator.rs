use std::{collections::HashMap, path::PathBuf};

use anyhow::Context;
use console::style;
use napi::{
  assert_type_of,
  bindgen_prelude::FromNapiValue,
  sys::{napi_env, napi_value},
  threadsafe_function::ThreadsafeFunction,
  JsBoolean, JsObject, Result, Status, ValueType,
};
use napi_derive::napi;
use serde::Serialize;

use crate::{
  async_fs,
  constants::{CSSType, CompilerType, FrameworkType, MEDIA_REGEX, STYLE_EXT_MAP},
  utils::{generate_with_template, normalize_path_str},
};

#[derive(Debug, Clone, Serialize)]
#[napi(object)]
#[serde(rename_all = "camelCase")]
pub struct CreateOptions {
  pub css: Option<CSSType>,
  pub css_ext: Option<String>,
  pub framework: Option<FrameworkType>,
  pub description: Option<String>,
  pub project_name: String,
  pub version: Option<String>,
  pub date: Option<String>,
  pub typescript: Option<bool>,
  pub build_es5: Option<bool>,
  pub template: String,
  pub page_name: Option<String>,
  pub compiler: Option<CompilerType>,
  pub set_page_name: Option<String>,
  pub sub_pkg: Option<String>,
  pub page_dir: Option<String>,
  pub set_sub_pkg_page_name: Option<String>,
  pub change_ext: Option<bool>,
  pub is_custom_template: Option<bool>,
  pub plugin_type: Option<String>,
  pub platforms: Option<Vec<String>>,
}

#[derive(Debug)]
pub struct JSReturnObject {
  pub set_page_name: Option<String>,
  pub change_ext: Option<bool>,
  pub set_sub_pkg_page_name: Option<String>,
}

impl FromNapiValue for JSReturnObject {
  unsafe fn from_napi_value(env: napi_env, napi_val: napi_value) -> Result<Self> {
    let obj = JsObject::from_napi_value(env, napi_val)?;
    let mut js_return_object = JSReturnObject {
      set_page_name: None,
      change_ext: None,
      set_sub_pkg_page_name: None,
    };
    let has_set_page_name = obj.has_named_property("setPageName")?;
    let has_change_ext = obj.has_named_property("changeExt")?;
    let has_set_sub_pkg_page_name = obj.has_named_property("setSubPkgName")?;
    if has_set_page_name {
      js_return_object.set_page_name = Some(obj.get_named_property::<String>("setPageName")?);
    }
    if has_set_sub_pkg_page_name {
      js_return_object.set_sub_pkg_page_name =
        Some(obj.get_named_property::<String>("setSubPkgName")?);
    }
    if has_change_ext {
      js_return_object.change_ext = Some(obj.get_named_property::<bool>("changeExt")?);
    }
    Ok(js_return_object)
  }
}

#[derive(Debug)]
pub enum JSReturn {
  Boolean(bool),
  Object(JSReturnObject),
}

impl FromNapiValue for JSReturn {
  unsafe fn from_napi_value(env: napi_env, napi_val: napi_value) -> Result<Self> {
    let is_bool = assert_type_of!(env, napi_val, ValueType::Boolean);
    let is_object = assert_type_of!(env, napi_val, ValueType::Object);
    if let Ok(()) = is_bool {
      let boolean = JsBoolean::from_napi_value(env, napi_val)?;
      return Ok(JSReturn::Boolean(boolean.get_value()?));
    }

    if let Ok(()) = is_object {
      let obj = JSReturnObject::from_napi_value(env, napi_val)?;
      return Ok(JSReturn::Object(obj));
    }

    Err(napi::Error::new(
      Status::InvalidArg,
      "Expected a boolean or object",
    ))
  }
}

#[derive(Debug, Clone)]
#[napi(constructor)]
pub struct Creator {
  pub template_root: String,
  pub destination_root: String,
}

#[napi]
impl Creator {
  pub fn new(template_root: String, destination_root: String) -> Self {
    Creator {
      template_root,
      destination_root,
    }
  }

  pub fn get_template_path(&self, args: &[&str]) -> String {
    let mut file_path = PathBuf::new();
    file_path.push(self.template_root.as_str());
    file_path.push("templates");
    for arg in args {
      file_path.push(arg);
    }
    file_path.to_string_lossy().to_string()
  }

  pub fn get_destination_path(&self, args: &[&str]) -> String {
    let mut file_path = PathBuf::new();
    for arg in args {
      file_path.push(arg);
    }
    if !file_path.is_absolute() {
      file_path = PathBuf::from(self.destination_root.as_str()).join(file_path);
    }
    let ext = file_path.extension();
    if let Some(ext) = ext {
      if ext == "tmpl" {
        file_path.set_extension("");
      }
    }
    let base_name = file_path.file_name().unwrap().to_string_lossy().to_string();
    let is_sass_partial = matches!(
      file_path
        .extension()
        .and_then(|extension| extension.to_str()),
      Some("sass" | "scss")
    );
    if !is_sass_partial {
      if let Some(stripped) = base_name.strip_prefix('_') {
        // `_xxx` in a template stands for the dotfile `.xxx`
        file_path.set_file_name(format!(".{}", stripped));
      }
    }
    file_path.to_string_lossy().to_string()
  }

  #[napi]
  pub async fn create_file_from_template(
    &self,
    template_name: String,
    template_path: String,
    dest_path: String,
    options: CreateOptions,
  ) -> napi::Result<()> {
    let from_path = normalize_path_str(template_path.as_str());
    let dest_path = normalize_path_str(dest_path.as_str());
    let from_path = self.get_template_path(&[&template_name, &from_path]);
    let dest_path = self.get_destination_path(&[&dest_path]);
    let result = generate_with_template(&from_path, &dest_path, &options).await;
    if let Err(e) = result {
      println!("创建文件错误，原因如下：");
      println!("{}", e);
      return Err(napi::Error::from_reason(format!("{:?}", e)));
    }
    Ok(())
  }

  pub async fn tempate(
    &self,
    from_path: &str,
    dest_path: &str,
    options: &CreateOptions,
  ) -> anyhow::Result<()> {
    if MEDIA_REGEX.is_match(from_path) {
      let dir_name = PathBuf::from(dest_path)
        .parent()
        .unwrap()
        .to_string_lossy()
        .to_string();
      async_fs::create_dir_all(&dir_name)
        .await
        .with_context(|| format!("文件夹创建失败: {}", dir_name))?;
      async_fs::copy(from_path, dest_path)
        .await
        .with_context(|| format!("文件复制失败: {}", from_path))?;
      return Ok(());
    }
    generate_with_template(from_path, dest_path, options).await?;
    Ok(())
  }

  pub async fn create_files(
    &self,
    files: &[&str],
    template_path: &str,
    options: &mut CreateOptions,
    js_handlers: &HashMap<String, ThreadsafeFunction<CreateOptions>>,
  ) -> anyhow::Result<()> {
    let current_style_ext = STYLE_EXT_MAP
      .get(&options.css.unwrap_or(CSSType::None))
      .unwrap_or(&"css");
    options.css_ext = Some(current_style_ext.to_string());
    for file in files {
      let file_relative_path = normalize_path_str(file.replace(template_path, "").as_str());
      let framework = options.framework;
      let is_vue_framework = framework.is_some_and(|framework| framework == FrameworkType::Vue3);
      if is_vue_framework && file_relative_path.ends_with(".jsx") {
        continue;
      }
      if !is_vue_framework && file_relative_path.ends_with(".vue") {
        continue;
      }
      let mut need_create_file = true;
      let mut page_name = file_relative_path.clone();
      let mut change_ext = true;
      let is_typescript = options.typescript.unwrap_or(false);
      // let is_custom_template = options.is_custom_template.unwrap_or(false);
      if js_handlers.contains_key(&file_relative_path) {
        let js_handler = js_handlers.get(&file_relative_path).unwrap().clone();
        let result = js_handler
          .call_async::<JSReturn>(Ok(options.clone()))
          .await
          .with_context(|| format!("模板自定义函数调用失败: {}", file_relative_path))?;
        match result {
          JSReturn::Boolean(boolean) => {
            need_create_file = boolean;
          }
          JSReturn::Object(obj) => {
            let set_page_name = obj.set_page_name;
            let change_ext_re = obj.change_ext;
            let set_sub_pkg_page_name = obj.set_sub_pkg_page_name;
            let sub_pkg = &options.sub_pkg;
            if sub_pkg.is_some() {
              // 创建分包页面模式
              if let Some(set_sub_pkg_page_name) = set_sub_pkg_page_name {
                page_name = set_sub_pkg_page_name;
              }
            } else {
              if let Some(set_page_name) = set_page_name {
                page_name = set_page_name;
              }
            }
            if let Some(change_ext_re) = change_ext_re {
              change_ext = change_ext_re;
            }
          }
        };
      }
      if need_create_file {
        let file_relative_path = format!("{}{}", template_path, file_relative_path);
        // if is_custom_template {
        //   file_relative_path = format!("{}/{}", template_path, file_relative_path);
        // }
        let dest_path = get_template_destination_path(
          self,
          &page_name,
          is_typescript,
          change_ext,
          current_style_ext,
        );
        let from_path: String = PathBuf::from(file_relative_path)
          .to_string_lossy()
          .to_string();
        self
          .tempate(from_path.as_str(), dest_path.as_str(), &options.clone())
          .await?;
        println!(
          "{} {}",
          style("✔").green(),
          style("创建文件: ".to_owned() + dest_path.as_str()).color256(238)
        );
      }
    }
    Ok(())
  }
}

fn get_template_destination_path(
  creator: &Creator,
  page_name: &str,
  is_typescript: bool,
  change_ext: bool,
  current_style_ext: &str,
) -> String {
  let mut dest_re_path = page_name.to_string();
  if dest_re_path.starts_with('/') {
    dest_re_path.remove(0);
  }
  let is_eslint_config = dest_re_path.ends_with(".eslintrc.js")
    || dest_re_path == "_eslintrc.js"
    || dest_re_path.ends_with("/_eslintrc.js")
    || dest_re_path.ends_with("\\_eslintrc.js");
  if is_typescript
    && change_ext
    && (dest_re_path.ends_with(".js") || dest_re_path.ends_with(".jsx"))
    && !(dest_re_path.ends_with("babel.config.js") || is_eslint_config)
  {
    dest_re_path = dest_re_path.replace(".js", ".ts");
  }
  if change_ext && dest_re_path.ends_with(".css") {
    dest_re_path = dest_re_path.replace(".css", format!(".{}", current_style_ext).as_str());
  }
  creator.get_destination_path(&[&dest_re_path])
}

#[cfg(test)]
mod tests {
  use super::*;
  use std::time::{SystemTime, UNIX_EPOCH};

  struct TestDirectory(PathBuf);

  impl TestDirectory {
    fn new() -> Self {
      let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
      let path =
        std::env::temp_dir().join(format!("taro-init-test-{}-{}", std::process::id(), nonce));
      std::fs::create_dir_all(&path).unwrap();
      Self(path)
    }
  }

  impl Drop for TestDirectory {
    fn drop(&mut self) {
      let _ = std::fs::remove_dir_all(&self.0);
    }
  }

  #[test]
  fn underscore_template_file_maps_to_dotfile() {
    let creator = Creator::new("/tpl".to_string(), "/dest".to_string());
    let dest = creator.get_destination_path(&["_eslintrc.js"]);
    assert!(
      dest.ends_with(".eslintrc.js")
        && !dest.ends_with("/eslintrc.js")
        && !dest.ends_with("\\eslintrc.js"),
      "expected a dotfile .eslintrc.js, got {}",
      dest
    );
  }

  #[test]
  fn sass_partial_template_files_keep_their_underscore_prefix() {
    let creator = Creator::new("/tpl".to_string(), "/dest".to_string());

    for (template_path, expected_file_name) in [
      ("src/styles/_variables.scss", "_variables.scss"),
      ("src/styles/_mixins.sass.tmpl", "_mixins.sass"),
    ] {
      let dest = creator.get_destination_path(&[template_path]);
      assert!(
        dest.ends_with(expected_file_name),
        "expected Sass partial to keep its underscore, got {}",
        dest
      );
    }
  }

  #[test]
  fn typescript_template_generation_keeps_underscore_eslint_config_as_js() {
    let creator = Creator::new("/tpl".to_string(), "/dest".to_string());
    let dest = get_template_destination_path(&creator, "_eslintrc.js", true, true, "css");
    assert!(
      dest.ends_with(".eslintrc.js"),
      "expected generated TypeScript template to keep .eslintrc.js, got {}",
      dest
    );
  }

  #[tokio::test]
  async fn typescript_create_files_keeps_underscore_eslint_config_as_js() {
    let temp = TestDirectory::new();
    let template_path = temp.0.join("templates").join("default");
    let destination_path = temp.0.join("project");
    let nested_template_path = template_path.join("nested");
    std::fs::create_dir_all(&nested_template_path).unwrap();

    let template_file = template_path.join("_eslintrc.js");
    std::fs::write(&template_file, "module.exports = {};\n").unwrap();
    let nested_template_file = nested_template_path.join("_eslintrc.js");
    std::fs::write(&nested_template_file, "module.exports = {};\n").unwrap();

    let creator = Creator::new(
      temp.0.to_string_lossy().to_string(),
      destination_path.to_string_lossy().to_string(),
    );
    let mut options = CreateOptions {
      css: None,
      css_ext: None,
      framework: None,
      description: None,
      project_name: "test-project".to_string(),
      version: None,
      date: None,
      typescript: Some(true),
      build_es5: None,
      template: "default".to_string(),
      page_name: None,
      compiler: None,
      set_page_name: None,
      sub_pkg: None,
      page_dir: None,
      set_sub_pkg_page_name: None,
      change_ext: None,
      is_custom_template: None,
      plugin_type: None,
      platforms: None,
    };
    let js_handlers = HashMap::new();
    let template_path = template_path.to_string_lossy().to_string();
    let template_file = template_file.to_string_lossy().to_string();
    let nested_template_file = nested_template_file.to_string_lossy().to_string();

    creator
      .create_files(
        &[&template_file, &nested_template_file],
        &template_path,
        &mut options,
        &js_handlers,
      )
      .await
      .unwrap();

    assert!(destination_path.join(".eslintrc.js").is_file());
    assert!(!destination_path.join(".eslintrc.ts").exists());
    assert!(destination_path.join("nested/.eslintrc.js").is_file());
    assert!(!destination_path.join("nested/.eslintrc.ts").exists());
  }

  #[test]
  fn typescript_template_generation_converts_regular_js_files() {
    let creator = Creator::new("/tpl".to_string(), "/dest".to_string());
    let dest = get_template_destination_path(&creator, "src/app.js", true, true, "css");
    assert!(
      dest.ends_with("src/app.ts"),
      "expected generated TypeScript template to convert app.js to app.ts, got {}",
      dest
    );
  }
}
