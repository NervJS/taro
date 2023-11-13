use std::{collections::HashMap, path::PathBuf, env};

use console::style;
use napi::threadsafe_function::ThreadsafeFunction;
use napi_derive::napi;
use spinners::{Spinner, Spinners};

use crate::{
  constants::{CSSType, CompilerType, FrameworkType, NpmType, FILE_FILTER, PACKAGES_MANAGEMENT},
  creator::{CreateOptions, Creator},
  utils::{get_all_files_in_folder, execute_command}, rn::edit::change_default_name_in_template,
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

  fn init_git(&self, project_path: &str) -> anyhow::Result<()> {
    let mut sp = Spinner::new(
      Spinners::Dots9,
      format!("cd {}, 执行 {}", style(self.name.as_str()).cyan().bold(), style("git init").cyan().bold()),
    );
    env::set_current_dir(project_path)?;
    // git init
    let output = std::process::Command::new("git")
      .arg("init")
      .output();

    match output {
      Ok(output) => {
        if output.status.success() {
          sp.stop_with_message(format!("{} {}", style("✔").green(), format!("{}", style("初始化 git 成功").green())));
        } else {
          sp.stop_with_message(format!("{} {}", style("✘").red(), format!("{}", style("初始化 git 失败").red())));
          if !output.stderr.is_empty() {
            println!("{}", String::from_utf8_lossy(&output.stderr));
          }
          if !output.stdout.is_empty() {
            println!("{}", String::from_utf8_lossy(&output.stdout));
          }
        }
      }
      Err(e) => {
        sp.stop_with_message(format!("{} {}", style("✘").red(), format!("{}", style("初始化 git 失败").red())));
        if e.kind() == std::io::ErrorKind::NotFound {
          println!("没有找到命令 git, 请检查！");
        } else {
          println!("{}", e);
        }
      }
    }
    Ok(())
  }

  async fn install_deps(&self) -> anyhow::Result<()> {
    let command = PACKAGES_MANAGEMENT.get(&self.npm);
    if let Some(command) = command {
      let command = command.command;
      println!("执行安装项目依赖 {}, 需要一会儿...", style(command.to_owned() + " install").cyan().bold());
      let output = execute_command(command, &["install"]).await;
      match output {
        Ok(_) => {
          println!("{} {}", style("✔").green(), format!("{}", style("安装项目依赖成功").green()));
          self.call_success();
        }
        Err(e) => {
          println!("{} {}", style("✘").red(), format!("{}", style("安装项目依赖失败，请自行重新安装！").red()));
          if e.to_string().contains("No such file or directory") {
            println!("没有找到命令 {}, 请检查！", command);
          }
        }
      }
    }
    Ok(())
  }

  fn call_success(&self) {
    println!("{}", style(format!("创建项目 {} 成功！", style(self.name.as_str()).green().bold())).green());
    println!("{}", style(format!("请进入项目目录 {} 开始工作吧！😝", style(self.name.as_str()).green().bold())).green());
  }

  pub async fn create(
    &self,
    js_handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
  ) -> anyhow::Result<()> {
    let project_path = PathBuf::from(&self.dir).join(&self.name);
    let project_path_str = project_path.to_string_lossy().to_string();
    let creator = Creator::new(self.template_root.clone(), project_path_str.clone());
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
    // 当选择 rn 模板时，替换默认项目名
    if self.template.eq("react-native") {
      change_default_name_in_template(&self.name, template_path.as_str(), project_path_str.as_str()).await?;
    }
    println!();
    self.init_git(project_path_str.as_str())?;
    let auto_install = self.auto_install.unwrap_or(true);
    if auto_install {
      self.install_deps().await?;
    } else {
      self.call_success();
    }
    Ok(())
  }
}
