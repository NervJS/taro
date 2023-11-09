use anyhow::Error;
use std::{fs, path::Path};

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
