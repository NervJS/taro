use std::path::PathBuf;

use anyhow::Ok;
use console::style;
use once_cell::sync::Lazy;
use regex::Regex;

use crate::{async_fs, constants::MEDIA_REGEX, utils::get_all_files_in_folder};

use super::validate::validate_project_name;

static DEFAULT_RN_PROJECT_NAME: &str = "taroDemo";
static PROJECT_NAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r#"target '(.*)' do"#).unwrap());

static UNDERSCORED_DOTFILES: [&str; 13] = [
  "buckconfig",
  "eslintrc.js",
  "flowconfig",
  "gitattributes",
  "gitignore",
  "prettierrc.js",
  "watchmanconfig",
  "editorconfig",
  "bundle",
  "ruby-version",
  "env.dev",
  "env.test",
  "env.prod",
];

async fn get_template_name(cwd: &str) -> anyhow::Result<String> {
  let file_path = PathBuf::from(cwd).join("./ios/Podfile");
  let result = async_fs::read(file_path).await?;
  let result_str = String::from_utf8_lossy(&result);
  let name = PROJECT_NAME_REGEX.captures(&result_str).unwrap();
  let name = if let Some(name) = name.get(1) {
    name.as_str()
  } else {
    DEFAULT_RN_PROJECT_NAME
  };
  Ok(name.to_string())
}

async fn replace_name_in_utf8_file(
  file_path: &str,
  project_name: &str,
  default_name: &str,
) -> anyhow::Result<()> {
  if MEDIA_REGEX.is_match(file_path) {
    return Ok(());
  }
  let file_content = async_fs::read(file_path).await?;
  let file_content_str = String::from_utf8_lossy(&file_content).to_string();
  let new_file_content_str = file_content_str
    .replace(default_name, project_name)
    .replace(
      default_name.to_lowercase().as_str(),
      project_name.to_lowercase().as_str(),
    );
  if new_file_content_str != file_content_str {
    async_fs::write(file_path, new_file_content_str.as_bytes()).await?;
  }
  Ok(())
}

fn should_rename_file(file_path: &str, name_to_replace: &str) -> bool {
  let file_path = PathBuf::from(file_path);
  let base_name = file_path.file_name();
  if let Some(base_name) = base_name {
    let base_name = base_name.to_string_lossy();
    base_name.contains(name_to_replace)
  } else {
    false
  }
}

// 重命名文件
async fn rename_file(file_path: &str, old_name: &str, new_name: &str) -> anyhow::Result<()> {
  let file_path = PathBuf::from(file_path);
  let base_name = file_path.file_name();
  if let Some(base_name) = base_name {
    let base_name = base_name.to_string_lossy();
    let new_base_name = base_name.replace(old_name, new_name);
    let new_file_path = file_path.with_file_name(new_base_name);
    async_fs::rename(file_path, new_file_path).await?;
  }
  Ok(())
}

async fn process_dot_files(file_path: &str) -> anyhow::Result<()> {
  let dot_file = UNDERSCORED_DOTFILES
    .iter()
    .find(|&&e| file_path.contains(&format!("_{}", e)));
  if let Some(&dot_file) = dot_file {
    rename_file(
      file_path,
      &format!("_{}", dot_file),
      &format!(".{}", dot_file),
    )
    .await?;
  }
  Ok(())
}

pub async fn change_default_name_in_template(
  project_name: &str,
  template_path: &str,
  project_path: &str,
) -> anyhow::Result<()> {
  let regex = validate_project_name(project_name);
  if !regex {
    println!("{}", style("因项目名称不符合 java package 包命名规则（只能包含字母、数字和下划线，且必须以字母开头），故项目默认名不做替换！").yellow());
    return Ok(());
  }
  let default_name = get_template_name(template_path).await?;
  let mut project_files = get_all_files_in_folder(
    project_path.to_string(),
    &["yarn.lock", "package-lock.json"],
    Some(true)
  )?;
  project_files.reverse();
  for file_path in project_files.iter() {
    let file_path = file_path.to_str();
    if file_path.is_none() {
      continue;
    }
    let file_path = file_path.unwrap();
    if file_path.contains("node_modules") {
      continue;
    }
    if !async_fs::metadata(file_path).await?.is_dir() {
      replace_name_in_utf8_file(file_path, project_name, default_name.as_str()).await?;
    }
    if should_rename_file(file_path, &default_name) {
      rename_file(file_path, &default_name, project_name).await?;
    }
    if should_rename_file(file_path, &default_name.to_lowercase()) {
      rename_file(
        file_path,
        &default_name.to_lowercase(),
        &project_name.to_lowercase(),
      )
      .await?;
    }

    process_dot_files(file_path).await?;
  }
  println!(
    "{}{}",
    style("✔ ").green(),
    style("项目名更新成功！").color256(238)
  );
  Ok(())
}
