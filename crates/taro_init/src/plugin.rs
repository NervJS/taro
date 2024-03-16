use std::{collections::HashMap, path::PathBuf};

use console::style;
use napi_derive::napi;

use crate::{
  creator::{CreateOptions, Creator},
  utils::{get_all_files_in_folder, init_git},
};

#[derive(Debug)]
#[napi(object)]
pub struct Plugin {
  pub project_root: String,
  pub project_name: String,
  pub description: Option<String>,
  pub plugin_type: String,
  pub template_root: String,
  pub version: String,
  pub template: String,
}

impl Plugin {
  pub fn new(
    project_root: String,
    project_name: String,
    description: Option<String>,
    plugin_type: String,
    template_root: String,
    version: String,
    template: String,
  ) -> Self {
    Plugin {
      project_root,
      project_name,
      description,
      plugin_type,
      template_root,
      version,
      template,
    }
  }

  pub async fn create(&self) -> anyhow::Result<()> {
    let project_path = PathBuf::from(&self.project_root).join(&self.project_name);
    let project_path_str = project_path.to_string_lossy().to_string();
    let creator = Creator::new(self.template_root.clone(), project_path_str.clone());
    let template_path = creator.get_template_path(&[&self.template]);
    let all_files = get_all_files_in_folder(template_path.clone(), &[], None)?;
    let mut options = CreateOptions {
      css_ext: None,
      css: None,
      framework: None,
      description: self.description.clone(),
      project_name: self.project_name.clone(),
      version: Some(self.version.clone()),
      date: None,
      typescript: None,
      template: self.template.clone(),
      page_name: None,
      compiler: None,
      set_page_name: None,
      change_ext: None,
      is_custom_template: None,
      plugin_type: Some(self.plugin_type.clone()),
    };
    let all_files = all_files.iter().filter_map(|f| f.to_str()).collect::<Vec<_>>();
    println!();
    println!(
      "{} {}",
      style("✔").green(),
      format!(
        "{}{}",
        style("创建插件: ").color256(238),
        style(self.project_name.as_str()).color256(238).bold()
      )
    );
    creator
      .create_files(
        all_files.as_slice(),
        template_path.as_str(),
        &mut options,
        &HashMap::new(),
      )
      .await?;
    println!();
    init_git(&self.project_name, project_path_str.as_str())?;
    println!(
      "{}",
      style(format!(
        "创建插件 {} 成功！",
        style(self.project_name.as_str()).green().bold()
      ))
      .green()
    );
    println!(
      "{}",
      style(format!(
        "请进入插件目录 {} 开始工作吧！😝",
        style(self.project_name.as_str()).green().bold()
      ))
      .green()
    );
    Ok(())
  }
}
