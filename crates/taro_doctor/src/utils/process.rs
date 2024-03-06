use anyhow::{Context, Error, Result};
use napi::tokio::process::Command;
use semver::Version;
use std::{env, os::unix::fs::PermissionsExt, path::Path, str::FromStr, vec};

use async_trait::async_trait;


pub struct ProcessUtils { }


impl ProcessUtils {
  pub fn get_candidate_paths (
    command: &str,
    paths: Vec<&str>,
    extensions: Vec<&str>,
    context: &Path
  ) -> Vec<String> {
    let with_extensions = if extensions.is_empty() {
      extensions
        .into_iter().map(|ext| command.to_string() + ext).collect()
    } else {
      vec![command.to_string()]
    };

    if Path::new(command).is_absolute() {
      return with_extensions
    }

    let mut candidates: Vec<String> = vec![];

    for path in paths {
      for ext in with_extensions.iter() {
        let path_buf = context
          .clone()
          .join(path)
          .join(ext);

        let dir = path_buf.to_str();
          
        let s = dir.unwrap()
          .to_string();

        candidates.push(s)
      }
    }

    candidates
  }

  pub async fn get_executable_path (
    executable: &str,
    directory: Option<&str>
  ) -> Result<String> {
    // get current working directory
    let working_directory_string = if directory.is_none() {
      env::current_dir()?
          .to_str()
          .ok_or(Error::msg("Failed to convert current directory to string"))?
          .to_string()
    } else {
      directory.unwrap().to_string()
    };

    let context = Path::new(working_directory_string.as_str());

    // get os sep
    let sep = if cfg!(target_os = "windows") { ";" } else { ":" };    
    
    let extensions = if cfg!(target_os = "windows") && context.extension().is_none() {
      env::var("PATHEXT")?.split(sep).map(String::from).collect()
    } else {
      vec![]
    };

    let paths = if executable.contains(sep) {
      vec![executable.to_string()]
    } else {
      env::var("PATH")?.split(sep).map(String::from).collect()
    };
  
    let candidates = ProcessUtils::get_candidate_paths(
      executable, 
      paths.iter().map(|s| s.as_str()).collect(),
      extensions.iter().map(|s| s.as_str()).collect(),
      context
    );


    let mut found_candidates: Vec<&str> = vec![];
    let is_executable = 0x40;
    let is_readable = 0x100;
    let is_executable_and_readable = is_executable | is_readable;

    for candidate in candidates.iter() {
      let file = tokio::fs::File::open(candidate.as_str()).await?;
      let metadata = file.metadata().await?;
      
      found_candidates.push(candidate.as_str());

      let permissions = metadata.permissions();
      let mode = permissions.mode();

      if (mode & is_executable_and_readable == is_executable_and_readable) {
        return Ok(candidate.to_string())
      }
    }

    Err(Error::msg(""))
  }

  pub async fn can_run (
    executable: &str,
    directory: Option<&str>
  ) -> Result<bool> {
    let result = ProcessUtils::get_executable_path(executable, directory)
      .await
      .context("Cannot not find executable.");

    match result {
      Ok(_) => {
        Ok(true)
      },
      Err(_) => {
        Ok(false)
      }
    }
  }

  pub async fn exits_happy (cli: &str, args: Vec<&str>) -> Result<String> {
    let mut command = Command::new(cli);

    for i in args {
      command.arg(i);
    }

    let output = command.output().await?;
    let stdout = String::from_utf8_lossy(&output.stdout);

    Ok(stdout.into_owned())
  } 
}


#[async_trait]
pub trait Process {
  async fn is_installed () -> Result<bool>;
  async fn get_version () -> Result<Version>;
}