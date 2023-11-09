#![deny(clippy::all)]
#[macro_use]
extern crate napi_derive;

use std::collections::HashMap;

use napi::threadsafe_function::ThreadsafeFunction;
use taro_init::{creator::CreateOptions, project::Project};

#[napi]
pub async fn create_project(
  conf: Project,
  handlers: HashMap<String, ThreadsafeFunction<CreateOptions>>,
) {
  let project = Project::new(
    conf.name,
    conf.dir,
    conf.npm,
    conf.description,
    conf.typescript,
    conf.template,
    conf.css,
    conf.framework,
    conf.auto_install,
    conf.template_root,
    conf.version,
    conf.date,
    conf.compiler,
  );
  let mut thread_safe_functions = HashMap::new();
  for (key, callback) in handlers {
    thread_safe_functions.insert(key, callback);
  }
  if let Err(e) = project.create(thread_safe_functions).await {
    println!("创建项目错误，原因如下：");
    println!("{:?}", e);
  }
}
