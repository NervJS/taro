use std::io::Result;

use duct::cmd;
use serde::Serialize;
use sysinfo::System;

use crate::common::Compiler;

#[derive(Debug, Clone, Serialize)]
pub struct Env {
  pub node_version: Option<String>,
  pub node_path: Option<String>,
  pub npm_version: Option<String>,
  pub npm_path: Option<String>,
  pub pnpm_version: Option<String>,
  pub pnpm_path: Option<String>,
  pub yarn_version: Option<String>,
  pub yarn_path: Option<String>,
  pub compiler: Option<Compiler>,
  pub taro_version: Option<String>,
  pub os: Option<String>,
}

impl Env {
  pub fn new() -> Self {
    Env {
      node_version: None,
      node_path: None,
      npm_version: None,
      npm_path: None,
      pnpm_version: None,
      pnpm_path: None,
      yarn_version: None,
      yarn_path: None,
      compiler: None,
      taro_version: None,
      os: None,
    }
  }

  pub fn get_node_version(&self) -> Result<String> {
    let node_version_result = cmd!("node", "--version").read()?;
    Ok(node_version_result)
  }

  pub fn get_node_path(&self) -> Result<String> {
    let node_path_result = cmd!("which", "node").read()?;
    Ok(node_path_result)
  }

  pub fn get_npm_version(&self) -> Result<String> {
    let npm_version_result = cmd!("npm", "--version").read()?;
    Ok(npm_version_result)
  }

  pub fn get_npm_path(&self) -> Result<String> {
    let npm_path_result = cmd!("which", "npm").read()?;
    Ok(npm_path_result)
  }

  pub fn get_pnpm_version(&self) -> Result<String> {
    let pnpm_version_result = cmd!("pnpm", "--version").read()?;
    Ok(pnpm_version_result)
  }

  pub fn get_pnpm_path(&self) -> Result<String> {
    let pnpm_path_result = cmd!("which", "pnpm").read()?;
    Ok(pnpm_path_result)
  }

  pub fn get_yarn_version(&self) -> Result<String> {
    let yarn_version_result = cmd!("yarn", "--version").read()?;
    Ok(yarn_version_result)
  }

  pub fn get_yarn_path(&self) -> Result<String> {
    let yarn_path_result = cmd!("which", "yarn").read()?;
    Ok(yarn_path_result)
  }

  pub fn get_os(&self) -> String {
    let sys_name = System::name();
    let sys_cpu_arch = System::cpu_arch();
    let sys_long_os_version = System::long_os_version();
    
    let sys_infos = vec![
      sys_name,
      sys_cpu_arch,
      sys_long_os_version,
    ];
    let sys_infos = sys_infos.into_iter().filter_map(|info| info).collect::<Vec<String>>();
    let sys_infos = sys_infos.join(" ");
    sys_infos
  }

  pub fn init(&mut self) {
    self.node_version = if let Ok(node_version) = self.get_node_version() {
      Some(node_version)
    } else {
      None
    };
    self.node_path = if let Ok(node_path) = self.get_node_path() {
      Some(node_path)
    } else {
      None
    };
    self.npm_version = if let Ok(npm_version) = self.get_npm_version() {
      Some(npm_version)
    } else {
      None
    };
    self.npm_path = if let Ok(npm_path) = self.get_npm_path() {
      Some(npm_path)
    } else {
      None
    };
    self.pnpm_version = if let Ok(pnpm_version) = self.get_pnpm_version() {
      Some(pnpm_version)
    } else {
      None
    };
    self.pnpm_path = if let Ok(pnpm_path) = self.get_pnpm_path() {
      Some(pnpm_path)
    } else {
      None
    };
    self.yarn_version = if let Ok(yarn_version) = self.get_yarn_version() {
      Some(yarn_version)
    } else {
      None
    };
    self.yarn_path = if let Ok(yarn_path) = self.get_yarn_path() {
      Some(yarn_path)
    } else {
      None
    };
    self.os = Some(self.get_os());
  }
  
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_get_node_version() {
    let env = Env::new();
    let node_version = env.get_node_path();
    println!("node_version: {:?}", node_version);
  }
}
