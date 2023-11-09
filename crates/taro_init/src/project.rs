use std::{collections::HashMap, path::PathBuf};

use console::style;
use napi::threadsafe_function::ThreadsafeFunction;
use napi_derive::napi;

use crate::{
  constants::{CSSType, CompilerType, FrameworkType, NpmType, FILE_FILTER},
  creator::{CreateOptions, Creator},
  utils::get_all_files_in_folder,
};

#[derive(Debug)]
#[napi(object)]
pub struct Project {
  pub name: String,
  pub dir: String,
  pub npm: NpmType,
  pub description: Option<String>,
  pub typescript: Option<bool>,
  pub template: String,
  pub css: CSSType,
  pub auto_install: Option<bool>,
  pub framework: FrameworkType,
  pub template_root: String,
  pub version: String,
  pub date: Option<String>,
  pub compiler: Option<CompilerType>,
}

impl Project {
  pub fn new(
    name: String,
    dir: String,
    npm: NpmType,
    description: Option<String>,
    typescript: Option<bool>,
    template: String,
    css: CSSType,
    framework: FrameworkType,
    auto_install: Option<bool>,
    template_root: String,
    version: String,
    date: Option<String>,
    compiler: Option<CompilerType>,
  ) -> Self {
    Project {
      name,
      dir,
      npm,
      description,
      typescript,
      template,
      css,
      auto_install,
      framework,
      template_root,
      version,
      date,
      compiler,
    }
  }

  pub async fn create(
    &self,
    js_handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
  ) -> anyhow::Result<()> {
    let project_path = PathBuf::from(&self.dir).join(&self.name);
    let project_path_str = project_path.to_string_lossy().to_string();
    let creator = Creator::new(self.template_root.clone(), project_path_str);
    let template_path = creator.get_template_path(&[&self.template]);
    let filter = &FILE_FILTER;
    let all_files = get_all_files_in_folder(template_path.clone(), filter)?;
    let mut create_options = CreateOptions {
      css: self.css.clone(),
      css_ext: None,
      framework: self.framework.clone(),
      description: self.description.clone(),
      project_name: self.name.clone(),
      version: Some(self.version.clone()),
      date: self.date.clone(),
      typescript: self.typescript.clone(),
      template: self.template.clone(),
      page_name: "index".to_string(),
      compiler: self.compiler.clone(),
      set_page_name: None,
      change_ext: None,
      is_custom_template: None,
    };
    let all_files = all_files.iter().map(|f| f.as_str()).collect::<Vec<_>>();
    println!();
    println!("{} {}", style("✔").green(), format!("{}{}", style("创建项目: ").color256(238), style(self.name.as_str()).color256(238).bold()));
    creator
      .create_files(
        all_files.as_slice(),
        template_path.as_str(),
        &mut create_options,
        &js_handlers,
      )
      .await?;
    Ok(())
  }
}
