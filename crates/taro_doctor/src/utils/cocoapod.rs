use anyhow::Result;
use async_trait::async_trait;
use semver::Version;

use crate::utils::Process;
use super::ProcessUtils;


/// 
/// cocoaspod status
pub enum CocoaPodStatus {
   // iOS plugins will not work, installation required.
   NotInstalled,

   // iOS plugins might not work, upgrade recommended.
   UnknownVersion,
   
   // iOS plugins will not work, upgrade required.
   BelowMinimumVersion,
   
   // iOS plugins may not work in certain situations (Swift, static libraries),
   // upgrade recommended.
   BelowRecommendedVersion,
   
   // Everything should be fine.
   Recommended,
   
   // iOS plugins will not work, re-install required.
   BrokenInstall,
}



pub struct CocoaPod {
  status: CocoaPodStatus
}


impl CocoaPod {
  pub fn new (status: CocoaPodStatus) -> CocoaPod {
    CocoaPod {
      status
    }
  }

  
}

#[async_trait]
impl Process for CocoaPod {
  async fn is_installed () -> Result<bool> {
    let output = ProcessUtils::exits_happy("which", vec!["pod"]).await?;
    Ok(output != "pod not found")
  }

  async fn get_version () -> Result<Version> {
    let output = ProcessUtils::exits_happy("pod", vec!["--version"]).await?;
    Ok(Version::parse(output.as_str())?)
  }
}

