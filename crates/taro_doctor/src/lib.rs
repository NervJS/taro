pub mod utils;
pub mod validators;


#[cfg(test)]
mod tests {
  use std::{path::Path};

use semver::Version;
use crate::utils::{CocoaPodStatus, ProcessUtils, Ruby, RubyStatus};
use self::utils::{CocoaPod, Process};

use super::*;


  #[tokio::test]
  async fn test_cocoapod () {
    let result = CocoaPod::is_installed().await.unwrap();
    assert_eq!(result, true, "Test failed: unexpected result");

    let result = CocoaPod::get_version().await.unwrap();
    assert_eq!(result, Version::parse("1.15.2").unwrap(), "Test failed: unexpected result");

    let pod = CocoaPod::new("1.11.0", "1.11.2");
    let status: CocoaPodStatus = pod.evaluate().await.unwrap();

    assert_eq!(status, CocoaPodStatus::Recommended, "Test failed: unexpected result");

    return ()
  }

  #[tokio::test]
  async fn test_ruby () {
    let result = Ruby::is_installed().await.unwrap();
    assert_eq!(result, true, "Test failed: unexpected result");

    let result = Ruby::get_version().await.unwrap();
    assert_eq!(result, Version::parse("2.7.2p137").unwrap(), "Test failed: unexpected result");

    let ruby = Ruby::new("2.7.2", "2.7.2");
    let status: RubyStatus = ruby.evaluate().await.unwrap();

    assert_eq!(status, RubyStatus::Recommended, "Test failed: unexpected result");

    return ()
  }

  #[tokio::test]
  async fn test_process () {
    let path = ProcessUtils::get_executable_path("pod", None).await.unwrap();
    assert_eq!(path, "/usr/local/bin/pod", "Test failed: unexpected result");

    let which = ProcessUtils::exits_happy("which", vec!["pod"]).await.unwrap();
    assert_eq!(which, true, "Test failed: unexpected result");

    let paths = ProcessUtils::get_candidate_paths(
      "pod",
      vec![
        "/Users/weiyanhai/.rvm/gems/ruby-2.7.2/bin", 
        "/Users/weiyanhai/.rvm/gems/ruby-2.7.5/bin"
      ],
      vec![],
      Path::new("/")
    );

    assert_eq!(paths, vec![
      "/Users/weiyanhai/.rvm/gems/ruby-2.7.2/bin/pod", 
      "/Users/weiyanhai/.rvm/gems/ruby-2.7.5/bin/pod"
    ], "Test failed: unexpected result");

    let can_run = ProcessUtils::can_run(
      "pod",
      None
    ).await.unwrap();

    assert_eq!(can_run, false, "Test failed: unexpected result");

    return ()
  }
}