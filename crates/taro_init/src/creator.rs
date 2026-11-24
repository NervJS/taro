use std::{collections::HashMap, future::Future, path::PathBuf};

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
        if dotfile_template_name(&base_name).is_some() {
          file_path.set_file_name(format!(".{}", stripped));
        } else {
          // Keep the legacy mapping for ordinary modules: `_helper.js` becomes
          // `helper.js`, while only known dotfile templates gain a leading dot.
          file_path.set_file_name(stripped);
        }
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
    let mut files_to_process = Vec::new();
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
      let source_path = format!("{}{}", template_path, file_relative_path);
      files_to_process.push((file_relative_path, source_path));
    }

    preflight_static_destinations(
      self,
      &files_to_process,
      options,
      current_style_ext,
      js_handlers,
    )?;

    let handler_options = options.clone();
    let is_typescript = options.typescript.unwrap_or(false);
    let has_sub_pkg = options.sub_pkg.is_some();
    let mut created_destinations: Vec<String> = Vec::new();
    process_template_files(
      files_to_process,
      |file_relative_path| {
        let js_handler = js_handlers.get(&file_relative_path).cloned();
        let handler_options = handler_options.clone();
        async move {
          match js_handler {
            Some(js_handler) => js_handler
              .call_async::<JSReturn>(Ok(handler_options))
              .await
              .map(Some)
              .with_context(|| format!("模板自定义函数调用失败: {}", file_relative_path)),
            None => Ok(None),
          }
        }
      },
      |file_relative_path, result| {
        let mut need_create_file = true;
        let mut page_name = file_relative_path.clone();
        let mut change_ext = true;
        if let Some(result) = result {
          match result {
            JSReturn::Boolean(boolean) => need_create_file = boolean,
            JSReturn::Object(obj) => {
              if has_sub_pkg {
                if let Some(set_sub_pkg_page_name) = obj.set_sub_pkg_page_name {
                  page_name = set_sub_pkg_page_name;
                }
              } else if let Some(set_page_name) = obj.set_page_name {
                page_name = set_page_name;
              }
              if let Some(change_ext_re) = obj.change_ext {
                change_ext = change_ext_re;
              }
            }
          }
        }
        if !need_create_file {
          return Ok(None);
        }

        let dest_path = get_template_destination_path(
          self,
          &page_name,
          is_typescript,
          change_ext,
          current_style_ext,
        );
        if let Some(previous_dest_path) = created_destinations
          .iter()
          .find(|previous| destination_paths_conflict(previous, &dest_path))
        {
          anyhow::bail!(
            "多个模板文件映射到冲突的目标路径 {} 和 {}",
            previous_dest_path,
            dest_path
          );
        }
        created_destinations.push(dest_path.clone());
        Ok(Some(dest_path))
      },
      {
        let creator = self.clone();
        let options = options.clone();
        move |from_path, dest_path| {
          let creator = creator.clone();
          let options = options.clone();
          async move {
            creator
              .tempate(from_path.as_str(), dest_path.as_str(), &options)
              .await?;
            println!(
              "{} {}",
              style("✔").green(),
              style("创建文件: ".to_owned() + dest_path.as_str()).color256(238)
            );
            Ok(())
          }
        }
      },
    )
    .await
  }
}

fn dotfile_template_name(base_name: &str) -> Option<&str> {
  let stripped = base_name.strip_prefix('_')?;
  let is_known_dotfile = matches!(
    stripped,
    "editorconfig"
      | "env.development"
      | "env.production"
      | "env.test"
      | "eslintrc"
      | "eslintrc.js"
      | "gitignore"
  );
  if is_known_dotfile || !stripped.contains('.') {
    Some(stripped)
  } else {
    None
  }
}

fn destination_paths_conflict(left: &str, right: &str) -> bool {
  let left = normalize_path_str(left).to_lowercase();
  let right = normalize_path_str(right).to_lowercase();
  left == right
    || left
      .strip_prefix(&right)
      .is_some_and(|suffix| suffix.starts_with('/'))
    || right
      .strip_prefix(&left)
      .is_some_and(|suffix| suffix.starts_with('/'))
}

fn preflight_static_destinations(
  creator: &Creator,
  files: &[(String, String)],
  options: &CreateOptions,
  current_style_ext: &str,
  js_handlers: &HashMap<String, ThreadsafeFunction<CreateOptions>>,
) -> anyhow::Result<()> {
  let mut destinations: Vec<(&str, String)> = Vec::new();
  for (file_relative_path, source_path) in files {
    // A custom handler can change or skip the destination. Those files are
    // checked at runtime after their handler runs; ordinary files can be
    // rejected atomically before any file or handler is executed.
    if js_handlers.contains_key(file_relative_path) {
      continue;
    }
    let dest_path = get_template_destination_path(
      creator,
      file_relative_path,
      options.typescript.unwrap_or(false),
      true,
      current_style_ext,
    );
    if let Some((previous_source, previous_dest)) = destinations
      .iter()
      .find(|(_, previous_dest)| destination_paths_conflict(previous_dest, &dest_path))
    {
      anyhow::bail!(
        "模板文件 {} 和 {} 映射到冲突的目标路径 {} 和 {}",
        previous_source,
        source_path,
        previous_dest,
        dest_path
      );
    }
    destinations.push((source_path, dest_path));
  }
  Ok(())
}

async fn process_template_files<H, HFut, D, W, WFut>(
  files: Vec<(String, String)>,
  mut handler: H,
  mut destination: D,
  mut write: W,
) -> anyhow::Result<()>
where
  H: FnMut(String) -> HFut,
  HFut: Future<Output = anyhow::Result<Option<JSReturn>>>,
  D: FnMut(String, Option<JSReturn>) -> anyhow::Result<Option<String>>,
  W: FnMut(String, String) -> WFut,
  WFut: Future<Output = anyhow::Result<()>>,
{
  for (file_relative_path, from_path) in files {
    let handler_result = handler(file_relative_path.clone()).await?;
    if let Some(dest_path) = destination(file_relative_path, handler_result)? {
      write(from_path, dest_path).await?;
    }
  }
  Ok(())
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
  fn ordinary_underscore_modules_keep_their_legacy_destination() {
    let creator = Creator::new("/tpl".to_string(), "/dest".to_string());
    let dest = creator.get_destination_path(&["_helper.js"]);
    assert!(
      dest.ends_with("helper.js") && !dest.ends_with(".helper.js"),
      "expected an ordinary underscore module to become helper.js, got {}",
      dest
    );
  }

  #[tokio::test]
  async fn create_files_keeps_ordinary_underscore_module_import_working() {
    let temp = TestDirectory::new();
    let template_root = temp.0.join("templates").join("custom");
    let destination_path = temp.0.join("project");
    std::fs::create_dir_all(&template_root).unwrap();

    let index_file = template_root.join("index.js");
    let helper_file = template_root.join("_helper.js");
    std::fs::write(&index_file, "module.exports = require('./helper');\n").unwrap();
    std::fs::write(&helper_file, "module.exports = 'helper';\n").unwrap();

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
      typescript: Some(false),
      build_es5: None,
      template: "custom".to_string(),
      page_name: None,
      compiler: None,
      set_sub_pkg_page_name: None,
      sub_pkg: None,
      page_dir: None,
      set_page_name: None,
      change_ext: None,
      is_custom_template: None,
      plugin_type: None,
      platforms: None,
    };
    let js_handlers = HashMap::new();
    let template_root = template_root.to_string_lossy().to_string();
    let index_file = index_file.to_string_lossy().to_string();
    let helper_file = helper_file.to_string_lossy().to_string();

    creator
      .create_files(
        &[&index_file, &helper_file],
        &template_root,
        &mut options,
        &js_handlers,
      )
      .await
      .unwrap();

    assert_eq!(
      std::fs::read_to_string(destination_path.join("index.js")).unwrap(),
      "module.exports = require('./helper');\n"
    );
    assert_eq!(
      std::fs::read_to_string(destination_path.join("helper.js")).unwrap(),
      "module.exports = 'helper';\n"
    );
    assert!(!destination_path.join(".helper.js").exists());
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

  #[tokio::test]
  async fn create_files_rejects_destination_collisions_before_writing_in_either_order() {
    for order in [
      ["_eslintrc.js", ".ESLINTRC.js"],
      [".ESLINTRC.js", "_eslintrc.js"],
      ["_config", ".config/settings.json"],
      [".config/settings.json", "_config"],
    ] {
      let temp = TestDirectory::new();
      let template_root = temp.0.join("templates").join("default");
      let destination_path = temp.0.join("project");
      std::fs::create_dir_all(&template_root).unwrap();
      for name in order {
        let source_path = template_root.join(name);
        std::fs::create_dir_all(source_path.parent().unwrap()).unwrap();
        std::fs::write(source_path, "template content\n").unwrap();
      }

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
        typescript: Some(false),
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
      let template_path = template_root.to_string_lossy().to_string();
      let files = order.map(|name| template_root.join(name).to_string_lossy().to_string());
      let file_refs = files.iter().map(String::as_str).collect::<Vec<_>>();

      let error = creator
        .create_files(&file_refs, &template_path, &mut options, &js_handlers)
        .await
        .expect_err("multiple templates must not overwrite the same destination");

      assert!(error.to_string().contains("冲突的目标路径"));
      assert!(
        !destination_path.exists(),
        "colliding templates must be rejected before any output is written"
      );
    }
  }

  #[tokio::test]
  async fn each_custom_handler_runs_after_prior_template_files_are_written() {
    let temp = TestDirectory::new();
    let template_root = temp.0.join("templates").join("default");
    let destination_root = temp.0.join("project");
    std::fs::create_dir_all(&template_root).unwrap();
    let first_source = template_root.join("first.js");
    let second_source = template_root.join("second.js");
    std::fs::write(&first_source, "first\n").unwrap();
    std::fs::write(&second_source, "second\n").unwrap();

    let files = vec![
      (
        "first.js".to_string(),
        first_source.to_string_lossy().to_string(),
      ),
      (
        "second.js".to_string(),
        second_source.to_string_lossy().to_string(),
      ),
    ];
    let handler_destination = destination_root.clone();
    let output_root = destination_root.clone();

    process_template_files(
      files,
      move |relative_path| {
        let destination_root = handler_destination.clone();
        async move {
          if relative_path == "second.js" {
            assert!(
              destination_root.join("first.js").is_file(),
              "the prior file must exist before the next custom handler runs"
            );
          }
          Ok(None)
        }
      },
      move |relative_path, _| {
        Ok(Some(
          output_root
            .join(relative_path)
            .to_string_lossy()
            .to_string(),
        ))
      },
      |from_path, dest_path| async move {
        let dest_path = PathBuf::from(dest_path);
        std::fs::create_dir_all(dest_path.parent().unwrap())?;
        std::fs::copy(PathBuf::from(from_path), dest_path)?;
        Ok(())
      },
    )
    .await
    .unwrap();

    assert!(destination_root.join("first.js").is_file());
    assert!(destination_root.join("second.js").is_file());
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
