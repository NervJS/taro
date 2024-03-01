

use regex::Regex;

pub struct Version {
  major: u32,
  minor: u32,
  patch: u32
}

impl Version {
  fn parse () -> Version {
    let pattern = RegExp::new(r"^(\d+)(\.(\d+)(\.(\d+))?)?");

    if let Some(captures) = pattern.captures() {
      if let (Some(major), Some(minor), Some(patch)) = (
          captures.get(1).map(|m| m.as_str()).parse::<u32>(),
          captures.get(2).map(|m| m.as_str()).parse::<u32>(),
          captures.get(3).map(|m| m.as_str()).parse::<u32>(),
      ) {
        return Version::new(major, minor, patch);
      }
    } else {
      println!("Invalid version string.");
    }
  }

  
  fn get_text () -> String {

  }

  fn compare (&self, other: Version) -> bool {

  }
}
