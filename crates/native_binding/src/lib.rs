#![deny(clippy::all)]
#[macro_use]
extern crate napi_derive;

use std::collections::HashMap;

use napi::{threadsafe_function::ThreadsafeFunction, Result};
use taro_init::{creator::CreateOptions, page::Page, plugin::Plugin, project::Project};

#[napi]
pub async fn create_project(
  conf: Project,
  handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
) -> Result<()> {
  let project: Project = Project::new(
    conf.project_root,
    conf.project_name,
    conf.npm,
    conf.description,
    conf.typescript,
    conf.build_es5,
    conf.template,
    conf.css,
    conf.framework,
    conf.auto_install,
    conf.template_root,
    conf.version,
    conf.date,
    conf.compiler,
    conf.period,
  );
  let mut thread_safe_functions = HashMap::new();
  for (key, callback) in handlers {
    thread_safe_functions.insert(key, callback);
  }
  if let Err(e) = project.create(thread_safe_functions).await {
    println!("创建项目错误，原因如下：");
    println!("{:?}", e);
    return Err(napi::Error::from_reason(format!("{:?}", e)));
  }
  Ok(())
}

#[napi]
pub async fn create_page(
  conf: Page,
  handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
) -> Result<()> {
  let page = Page::new(
    conf.project_dir,
    conf.project_name,
    conf.template,
    conf.template_root,
    conf.description,
    conf.page_name,
    conf.date,
    conf.framework,
    conf.css,
    conf.typescript,
    conf.compiler,
    conf.version,
    conf.is_custom_template,
    conf.custom_template_path,
    conf.base_page_files,
    conf.period,
    conf.sub_pkg,
    conf.page_dir,
  );
  let mut thread_safe_functions = HashMap::new();
  for (key, callback) in handlers {
    thread_safe_functions.insert(key, callback);
  }
  if let Err(e) = page.create(thread_safe_functions).await {
    println!("创建页面错误，原因如下：");
    println!("{:?}", e);
    return Err(napi::Error::from_reason(format!("{:?}", e)));
  }
  Ok(())
}

#[napi]
pub async fn create_plugin(conf: Plugin) -> Result<()> {
  let plugin = Plugin::new(
    conf.project_root,
    conf.project_name,
    conf.description,
    conf.plugin_type,
    conf.template_root,
    conf.version,
    conf.template,
  );
  if let Err(e) = plugin.create().await {
    println!("创建插件错误，原因如下：");
    println!("{:?}", e);
    return Err(napi::Error::from_reason(format!("{:?}", e)));
  }
  Ok(())
}
