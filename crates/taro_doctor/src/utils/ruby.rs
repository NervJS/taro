use semver::Version;
use anyhow::{Error, Result};
use async_trait::async_trait;
use super::{Process, ProcessUtils};

#[derive(Debug, PartialEq, Eq)]
pub enum RubyStatus {
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


pub struct Ruby {
  minium_version: Version,
  recommended_version: Version
}


impl Ruby {
  pub fn new (minium_version: &str, recommended_version: &str) -> Ruby {
    Ruby {
      minium_version: Version::parse(minium_version).unwrap(),
      recommended_version: Version::parse(recommended_version).unwrap()
    }
  }
}

#[async_trait]
impl Process<RubyStatus> for Ruby {
  async fn is_installed () -> Result<bool> {
    Ok(ProcessUtils::exits_happy("which", vec!["pod"]).await?)
  }

  async fn get_version () -> Result<Version> {
    let output = ProcessUtils::run("ruby", vec!["--version"], None).await?;
     
    if output.status.success() {
      let stdout = String::from_utf8(output.stdout)?;
      let version = Version::parse(stdout.trim())?;

      Ok(version)
    } else {
      Err(Error::msg("Cannot get ruby version."))
    }
  }

  async fn evaluate (&self) -> Result<RubyStatus> {
    let is_installed = Ruby::is_installed().await?;

    if !is_installed {
      return Ok(RubyStatus::NotInstalled)
    }

    let version = Ruby::get_version()
      .await;

    Ok(match version {
      Ok (version) => {
        let minium_version = &self.minium_version;
        let recommended_version = &self.recommended_version;
          
        if &version < minium_version {
          RubyStatus::BelowMinimumVersion
        } else if &version < recommended_version {
          RubyStatus::BelowRecommendedVersion
        } else {
          RubyStatus::Recommended
        }
      },
      Err (_) => {
        RubyStatus::UnknownVersion
      }
    })
  }
}



