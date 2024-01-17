use std::{path::Path, fs};

use anyhow::Context;

use crate::{constants::HANDLEBARS, async_fs};

pub async fn generate_with_template(from_path: &str, dest_path: &str, data: &impl serde::Serialize) -> anyhow::Result<()> {
  let form_template = async_fs::read(from_path).await.with_context(|| format!("文件读取失败: {}", from_path))?;
  let from_template = String::from_utf8_lossy(&form_template);
  let template = if from_template == "" {
    "".to_string()
  } else {
    HANDLEBARS.render_template(&from_template, data).with_context(|| format!("模板渲染失败: {}", from_path))?
  };
  let dir_name = Path::new(dest_path).parent().unwrap().to_string_lossy().to_string();
  async_fs::create_dir_all(&dir_name).await.with_context(|| format!("文件夹创建失败: {}", dir_name))?;
  let metadata = async_fs::metadata(from_path).await.with_context(|| format!("文件读取失败: {}", from_path))?;
  async_fs::write(dest_path, template).await.with_context(|| format!("文件写入失败: {}", dest_path))?;
  #[cfg(unix)]
  async_fs::set_permissions(dest_path, metadata.permissions()).await.with_context(|| format!("文件权限设置失败: {}", dest_path))?;
  Ok(())
}

pub fn generate_with_template_content_sync(template: &str, dest_path: &str, data: &impl serde::Serialize) -> anyhow::Result<()> {
  let template = if template.is_empty() {
    "".to_string()
  } else {
    HANDLEBARS.render_template(template, data).with_context(|| format!("模板渲染失败: {}", dest_path))?
  };
  let dir_name = Path::new(dest_path).parent().unwrap().to_string_lossy().to_string();
  fs::create_dir_all(&dir_name).with_context(|| format!("文件夹创建失败: {}", dir_name))?;
  fs::write(dest_path, template).with_context(|| format!("文件写入失败: {}", dest_path))?;
  Ok(())
}
