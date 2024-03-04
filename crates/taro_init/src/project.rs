use std::{collections::HashMap, path::PathBuf};

use console::style;
use napi::threadsafe_function::ThreadsafeFunction;
use napi_derive::napi;

use crate::{
  constants::{CSSType, CompilerType, FrameworkType, NpmType, PeriodType, FILE_FILTER},
  creator::{CreateOptions, Creator},
  rn::edit::change_default_name_in_template,
  utils::{get_all_files_in_folder, init_git, install_deps},
};

#[derive(Debug)]
#[napi(object)]
pub struct Project {
  pub project_root: String,
  pub project_name: String,
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
  pub period: PeriodType,
}

impl Project {
  pub fn new(
    project_root: String,
    project_name: String,
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
    period: PeriodType,
  ) -> Self {
    Project {
      project_root,
      project_name,
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
      period,
    }
  }

  fn call_success(&self) {
    println!(
      "{}",
      style(format!(
        "创建项目 {} 成功！",
        style(self.project_name.as_str()).green().bold()
      ))
      .green()
    );
    println!(
      "{}",
      style(format!(
        "请进入项目目录 {} 开始工作吧！😝",
        style(self.project_name.as_str()).green().bold()
      ))
      .green()
    );
  }

  pub async fn create(
    &self,
    js_handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
  ) -> anyhow::Result<()> {
    let project_path = PathBuf::from(&self.project_root).join(&self.project_name);
    let project_path_str = project_path.to_string_lossy().to_string();
    let creator = Creator::new(self.template_root.clone(), project_path_str.clone());
    let template_path = creator.get_template_path(&[&self.template]);
    let filter = &FILE_FILTER;
    let all_files = get_all_files_in_folder(template_path.clone(), filter, None)?;
    let mut create_options = CreateOptions {
      css: Some(self.css.clone()),
      css_ext: None,
      framework: Some(self.framework.clone()),
      description: self.description.clone(),
      project_name: self.project_name.clone(),
      version: Some(self.version.clone()),
      date: self.date.clone(),
      typescript: self.typescript.clone(),
      template: self.template.clone(),
      page_name: Some("index".to_string()),
      compiler: self.compiler.clone(),
      set_page_name: None,
      change_ext: None,
      is_custom_template: None,
      plugin_type: None,
    };
    let all_files = all_files.iter().filter_map(|f| f.to_str()).collect::<Vec<_>>();
    println!();
    println!(
      "{} {}",
      style("✔").green(),
      format!(
        "{}{}",
        style("创建项目: ").color256(238),
        style(self.project_name.as_str()).color256(238).bold()
      )
    );
    creator
      .create_files(
        all_files.as_slice(),
        template_path.as_str(),
        &mut create_options,
        &js_handlers,
      )
      .await?;
    // 当选择 rn 模板时，替换默认项目名
    if self.template.eq("react-native") {
      change_default_name_in_template(
        &self.project_name,
        template_path.as_str(),
        project_path_str.as_str(),
      )
      .await?;
    }
    println!();
    init_git(&self.project_name, project_path_str.as_str())?;
    let auto_install = self.auto_install.unwrap_or(true);
    if auto_install {
      install_deps(&self.npm, || self.call_success()).await?;
    } else {
      self.call_success();
    }
    Ok(())
  }
}
