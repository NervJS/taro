pub mod utils;
pub mod validators;


#[cfg(test)]
mod tests {
  use std::{path::Path, str::FromStr};

use semver::Version;

use crate::utils::ProcessUtils;

use self::utils::{CocoaPod, Process};

use super::*;

  #[tokio::test]
  async fn test_cocoapod_is_installed () {
    let result = CocoaPod::is_installed().await.unwrap();
    assert_eq!(result, true, "Test failed: unexpected result");

    return ()
  }

  #[tokio::test]
  async fn test_cocoapod_get_version () {
    let result = CocoaPod::get_version().await.unwrap();
    assert_eq!(result, Version::parse("1.15.2").unwrap(), "Test failed: unexpected result");

    return ()
  }

  #[tokio::test]
  async fn get_candidate_paths () {
    let output = ProcessUtils::get_candidate_paths(
      "pod",
      vec!["/Users/weiyanhai/.rvm/gems/ruby-2.7.2/bin"],
      vec![".dat"],
      Path::new("/aaa")
    );

    assert_eq!(output, vec!["1"], "Test failed: unexpected result");
    return ()
  }

  #[tokio::test]
  async fn get_executable_path () {
    let output = ProcessUtils::get_executable_path("/usr/local/bin/pod", None).await.unwrap();
    assert_eq!(output, ":", "Test failed: unexpected result");
    return ()
  }

  #[tokio::test]
  async fn test_process () {
    let output = ProcessUtils::exits_happy("which", vec!["pod"]).await.unwrap();
    assert_eq!(output, "/usr/local/bin/pod\n", "Test failed: unexpected result");
    return ()
  }
}