use anyhow::{Error, Ok};
use futures::FutureExt;
use std::{fs, path::Path, process::Stdio};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

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
