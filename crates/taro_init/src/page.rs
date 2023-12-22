use std::{collections::HashMap, path::PathBuf};

use console::style;
use napi::threadsafe_function::ThreadsafeFunction;
use napi_derive::napi;

use crate::{
  async_fs,
  constants::{CSSType, CompilerType, FrameworkType, PeriodType},
  creator::{CreateOptions, Creator},
};

#[derive(Debug)]
#[napi(object)]
pub struct Page {
  pub project_dir: String,
  pub project_name: String,
  pub template: String,
  pub template_root: String,
  pub description: Option<String>,
  pub page_name: String,
  pub date: Option<String>,
  pub framework: FrameworkType,
  pub css: CSSType,
  pub typescript: Option<bool>,
  pub compiler: Option<CompilerType>,
  pub version: Option<String>,
  pub is_custom_template: Option<bool>,
  pub custom_template_path: Option<String>,
  pub base_page_files: Vec<String>,
  pub period: PeriodType,
}

impl Page {
  pub fn new(
    project_dir: String,
    project_name: String,
    template: String,
    template_root: String,
    description: Option<String>,
    page_name: String,
    date: Option<String>,
    framework: FrameworkType,
    css: CSSType,
    typescript: Option<bool>,
    compiler: Option<CompilerType>,
    version: Option<String>,
    is_custom_template: Option<bool>,
    custom_template_path: Option<String>,
    base_page_files: Vec<String>,
    period: PeriodType,
  ) -> Self {
    Page {
      project_dir,
      project_name,
      template,
      template_root,
      description,
      page_name,
      date,
      framework,
      css,
      typescript,
      compiler,
      version,
      is_custom_template,
      custom_template_path,
      base_page_files,
      period,
    }
  }

  pub async fn create(
    &self,
    js_handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
  ) -> anyhow::Result<()> {
    let project_path = PathBuf::from(&self.project_dir);
    let project_path_str = project_path.to_string_lossy().to_string();
    let creator = Creator::new(self.template_root.clone(), project_path_str.clone());
    let template_path = creator.get_template_path(&[&self.template]);
    let template_path = if self.is_custom_template.unwrap_or(false) {
      self.custom_template_path.as_ref().unwrap()
    } else {
      &template_path
    };
    if async_fs::metadata(&template_path).await.is_err() {
      println!(
        "{}",
        style(format!("创建页面错误：找不到模板 {}", template_path)).red()
      );
      return Ok(());
    }
    let mut options = CreateOptions {
      css: Some(self.css.clone()),
      css_ext: None,
      framework: Some(self.framework.clone()),
      description: self.description.clone(),
      project_name: self.project_name.clone(),
      version: self.version.clone(),
      date: self.date.clone(),
      typescript: self.typescript.clone(),
      template: self.template.clone(),
      page_name: Some(self.page_name.clone()),
      compiler: self.compiler.clone(),
      set_page_name: None,
      change_ext: None,
      is_custom_template: self.is_custom_template.clone(),
      plugin_type: None,
    };
    let files = self
      .base_page_files
      .iter()
      .map(|f| f.as_str())
      .collect::<Vec<_>>();
    creator
      .create_files(files.as_slice(), template_path, &mut options, &js_handlers)
      .await?;
    Ok(())
  }
}
