use anyhow::{Error, Ok};
use console::style;
use futures::FutureExt;
use spinners::{Spinner, Spinners};
use taro_shared::constants::NpmType;
use std::{env, process, result};
use std::{fs, path::Path, process::Stdio};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

use crate::constants::PACKAGES_MANAGEMENT;

pub fn get_all_files_in_folder(folder: String, filter: &[&str]) -> Result<Vec<String>, Error> {
  let mut files = Vec::new();
  let paths = fs::read_dir(folder)?;
  for path in paths {
    let path = path?;
    if path.path().is_dir() {
      let sub_files = get_all_files_in_folder(path.path().to_string_lossy().to_string(), filter)?;
      files.extend(sub_files);
    } else {
      let file_name = path.file_name().to_string_lossy().to_string();
      if !filter.contains(&file_name.as_str()) {
        files.push(path.path().to_string_lossy().to_string());
      }
    }
  }
  Ok(files)
}

pub fn normalize_path_str(path: &str) -> String {
  let mut path = path.replace("\\", "/");
  if path.ends_with("/") {
    path = path[..path.len() - 1].to_string();
  }
  path
}

pub fn normalize_path_path(p: &dyn AsRef<Path>) -> String {
  let path = p.as_ref().to_string_lossy().to_string();
  normalize_path_str(&path)
}

pub async fn execute_command(cmd: &str, args: &[&str]) -> anyhow::Result<()> {
  let mut command = Command::new(cmd);
  command.args(args);

  let mut child = command
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()?;
  let stdout_handle = child.stdout.take().unwrap();
  let stderr_handle = child.stderr.take().unwrap();

  let stdout_future = process_lines(stdout_handle).fuse();
  let stderr_future = process_lines(stderr_handle).fuse();
  tokio::select! {
    _ = stdout_future => {},
    _ = stderr_future => {},
  }

  let status = child.wait().await?;
  if status.success() {
    Ok(())
  } else {
    Err(Error::msg(format!(
      "Command failed with exit code: {}",
      status
    )))
  }
}

async fn process_lines<R>(reader: R)
where
  R: tokio::io::AsyncRead + Unpin,
{
  let mut lines = BufReader::new(reader).lines();

  while let Some(line) = lines.next_line().await.unwrap() {
    println!("{}", line);
  }
}

pub async fn install_deps<F>(npm: &NpmType, cb: F) -> anyhow::Result<()>
where
  F: FnOnce(),
{
  let command = PACKAGES_MANAGEMENT.get(npm);
  if let Some(command) = command {
    let command = command.command;
    println!(
      "执行安装项目依赖 {}, 需要一会儿...",
      style(command.to_owned() + " install").cyan().bold()
    );
    let output = execute_command(command, &["install"]).await;
    match output {
      result::Result::Ok(_) => {
        println!(
          "{} {}",
          style("✔").green(),
          format!("{}", style("安装项目依赖成功").green())
        );
        cb();
      }
      Err(e) => {
        println!(
          "{} {}",
          style("✘").red(),
          format!("{}", style("安装项目依赖失败，请自行重新安装！").red())
        );
        if e.to_string().contains("No such file or directory") {
          println!("没有找到命令 {}, 请检查！", command);
        }
      }
    }
  }
  Ok(())
}

pub fn init_git(project_name: &str, project_path: &str) -> anyhow::Result<()> {
  let mut sp = Spinner::new(
    Spinners::Dots9,
    format!(
      "cd {}, 执行 {}",
      style(project_name).cyan().bold(),
      style("git init").cyan().bold()
    ),
  );
  env::set_current_dir(project_path)?;
  // git init
  let output = process::Command::new("git").arg("init").output();

  match output {
    result::Result::Ok(output) => {
      if output.status.success() {
        sp.stop_with_message(format!(
          "{} {}",
          style("✔").green(),
          format!("{}", style("初始化 git 成功").green())
        ));
      } else {
        sp.stop_with_message(format!(
          "{} {}",
          style("✘").red(),
          format!("{}", style("初始化 git 失败").red())
        ));
        if !output.stderr.is_empty() {
          println!("{}", String::from_utf8_lossy(&output.stderr));
        }
        if !output.stdout.is_empty() {
          println!("{}", String::from_utf8_lossy(&output.stdout));
        }
      }
    }
    Err(e) => {
      sp.stop_with_message(format!(
        "{} {}",
        style("✘").red(),
        format!("{}", style("初始化 git 失败").red())
      ));
      if e.kind() == std::io::ErrorKind::NotFound {
        println!("没有找到命令 git, 请检查！");
      } else {
        println!("{}", e);
      }
    }
  }
  Ok(())
}
